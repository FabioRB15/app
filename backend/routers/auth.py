from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import logging

from models import (
    User, UserCreate, UserLogin, SocialLoginData, AuthResponse,
    PasswordResetRequest, PasswordResetToken, PasswordResetConfirm,
    EmailVerificationToken, EmailVerificationRequest
)
from database import Database, db
from security import (
    hash_password, verify_password, create_jwt_token, 
    generate_reset_token, get_current_user,
    send_password_reset_email, send_verification_email
)
from config import GOOGLE_CLIENT_ID

router = APIRouter()
logger = logging.getLogger(__name__)

# Authentication Endpoints
@router.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user with email and password"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
            provider="email",
            is_verified=False  # Require email verification
        )
        
        # Save to database
        await db.users.insert_one(user.dict())
        
        # Generate and send email verification
        verify_token = generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        verification = EmailVerificationToken(
            user_id=user.id,
            email=user.email,
            token=verify_token,
            expires_at=expires_at
        )
        
        await db.email_verification_tokens.insert_one(verification.dict())
        send_verification_email(user.email, verify_token)
        
        # Create JWT token
        token = create_jwt_token(user.id, user.email)
        
        # Remove password hash from response
        user_response = user.dict()
        user_response.pop('password_hash', None)
        
        return AuthResponse(
            user=User(**user_response),
            token=token,
            message="User registered successfully. Please check your email to verify your account."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/auth/login", response_model=AuthResponse)
async def login_user(login_data: UserLogin):
    """Login user with email and password"""
    try:
        # Find user
        user_doc = await db.users.find_one({"email": login_data.email})
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = User(**user_doc)
        
        # Check password
        if not user.password_hash or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create JWT token
        token = create_jwt_token(user.id, user.email)
        
        # Remove password hash from response
        user_response = user.dict()
        user_response.pop('password_hash', None)
        
        return AuthResponse(
            user=User(**user_response),
            token=token,
            message="Login successful"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/auth/social", response_model=AuthResponse)
async def social_login(social_data: SocialLoginData):
    """Login or register user with social provider (Google/Facebook)"""
    try:
        # Check if user exists by email
        user_doc = await db.users.find_one({"email": social_data.email})
        
        if user_doc:
            # User exists, update with social info if needed
            user = User(**user_doc)
            updated = False
            
            if user.provider != social_data.provider:
                user.provider = social_data.provider
                user.provider_id = social_data.id
                updated = True
            
            if social_data.picture and user.avatar != social_data.picture:
                user.avatar = social_data.picture
                updated = True
            
            if updated:
                user.updated_at = datetime.utcnow()
                await db.users.replace_one({"id": user.id}, user.dict())
        else:
            # Create new user from social data
            user = User(
                name=social_data.name,
                email=social_data.email,
                avatar=social_data.picture,
                provider=social_data.provider,
                provider_id=social_data.id,
                is_verified=True  # Social logins are pre-verified
            )
            await db.users.insert_one(user.dict())
        
        # Create JWT token
        token = create_jwt_token(user.id, user.email)
        
        # Remove password hash from response
        user_response = user.dict()
        user_response.pop('password_hash', None)
        
        return AuthResponse(
            user=User(**user_response),
            token=token,
            message="Social login successful"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error with social login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/auth/google", response_model=AuthResponse)
async def google_login(request_data: dict):
    """Login or register user with Google OAuth token"""
    try:
        # Get the credential token from request
        credential = request_data.get('credential')
        if not credential:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Google credential"
            )
        
        # Verify the Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
            # Verify token issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            # Extract user information from Google token
            google_user_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)
            
            # Check if user exists by email
            user_doc = await db.users.find_one({"email": email})
            
            if user_doc:
                # User exists, update with Google info if needed
                user = User(**user_doc)
                updated = False
                
                if user.provider != 'google':
                    user.provider = 'google'
                    user.provider_id = google_user_id
                    updated = True
                
                if picture and user.avatar != picture:
                    user.avatar = picture
                    updated = True
                
                if not user.is_verified and email_verified:
                    user.is_verified = True
                    updated = True
                
                if updated:
                    user.updated_at = datetime.utcnow()
                    await db.users.replace_one({"id": user.id}, user.dict())
            else:
                # Create new user from Google data
                user = User(
                    name=name,
                    email=email,
                    avatar=picture,
                    provider='google',
                    provider_id=google_user_id,
                    is_verified=email_verified
                )
                await db.users.insert_one(user.dict())
            
            # Create JWT token
            token = create_jwt_token(user.id, user.email)
            
            # Remove password hash from response
            user_response = user.dict()
            user_response.pop('password_hash', None)
            
            return AuthResponse(
                user=User(**user_response),
                token=token,
                message="Google login successful"
            )
            
        except ValueError as e:
            # Invalid token
            logger.error(f"Invalid Google token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error with Google login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/auth/verify")
async def verify_token(current_user: User = Depends(get_current_user)):
    """Verify JWT token and return user info"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Remove password hash from response
    user_response = current_user.dict()
    user_response.pop('password_hash', None)
    
    return {"user": User(**user_response), "message": "Token is valid"}

@router.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Remove password hash from response
    user_response = current_user.dict()
    user_response.pop('password_hash', None)
    
    return {"user": User(**user_response)}

# Password Reset Endpoints
@router.post("/auth/forgot-password")
async def forgot_password(request_data: PasswordResetRequest):
    """Request password reset - sends reset token via email"""
    try:
        # Check if user exists
        user_doc = await db.users.find_one({"email": request_data.email})
        if not user_doc:
            # Don't reveal if email exists or not for security
            return {"message": "If the email exists, a password reset link has been sent"}
        
        user = User(**user_doc)
        
        # Generate reset token
        reset_token = generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=1)  # 1 hour expiry
        
        # Store reset token in database
        password_reset = PasswordResetToken(
            user_id=user.id,
            email=user.email,
            token=reset_token,
            expires_at=expires_at
        )
        
        # Remove any existing unused tokens for this user
        await db.password_reset_tokens.delete_many({
            "user_id": user.id,
            "used": False
        })
        
        # Insert new token
        await db.password_reset_tokens.insert_one(password_reset.dict())
        
        # Send email (mock implementation)
        send_password_reset_email(user.email, reset_token)
        
        return {"message": "If the email exists, a password reset link has been sent"}
        
    except Exception as e:
        logger.error(f"Error in forgot password: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/auth/reset-password")
async def reset_password(reset_data: PasswordResetConfirm):
    """Reset password using token"""
    try:
        # Find valid reset token
        token_doc = await db.password_reset_tokens.find_one({
            "token": reset_data.token,
            "used": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not token_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        token_obj = PasswordResetToken(**token_doc)
        
        # Get user
        user_doc = await db.users.find_one({"id": token_obj.user_id})
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = User(**user_doc)
        
        # Validate new password
        if len(reset_data.new_password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters long"
            )
        
        # Update user's password
        new_password_hash = hash_password(reset_data.new_password)
        user.password_hash = new_password_hash
        user.updated_at = datetime.utcnow()
        
        # Save updated user
        await db.users.replace_one({"id": user.id}, user.dict())
        
        # Mark token as used
        await db.password_reset_tokens.update_one(
            {"_id": token_doc["_id"]},
            {"$set": {"used": True}}
        )
        
        return {"message": "Password reset successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting password: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Email Verification Endpoints
@router.post("/auth/resend-verification")
async def resend_verification_email_endpoint(request_data: EmailVerificationRequest):
    """Resend email verification"""
    try:
        # Check if user exists
        user_doc = await db.users.find_one({"email": request_data.email})
        if not user_doc:
            return {"message": "If the email exists, a verification email has been sent"}
        
        user = User(**user_doc)
        
        if user.is_verified:
            return {"message": "Email is already verified"}
        
        # Generate verification token
        verify_token = generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hour expiry
        
        # Store verification token
        verification = EmailVerificationToken(
            user_id=user.id,
            email=user.email,
            token=verify_token,
            expires_at=expires_at
        )
        
        # Remove any existing tokens for this user
        await db.email_verification_tokens.delete_many({"user_id": user.id})
        
        # Insert new token
        await db.email_verification_tokens.insert_one(verification.dict())
        
        # Send verification email (mock implementation)
        send_verification_email(user.email, verify_token)
        
        return {"message": "Verification email sent"}
        
    except Exception as e:
        logger.error(f"Error resending verification: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/auth/verify-email/{token}")
async def verify_email(token: str):
    """Verify email using token"""
    try:
        # Find valid verification token
        token_doc = await db.email_verification_tokens.find_one({
            "token": token,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not token_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token"
            )
        
        token_obj = EmailVerificationToken(**token_doc)
        
        # Get user
        user_doc = await db.users.find_one({"id": token_obj.user_id})
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = User(**user_doc)
        
        # Mark user as verified
        user.is_verified = True
        user.updated_at = datetime.utcnow()
        
        # Save updated user
        await db.users.replace_one({"id": user.id}, user.dict())
        
        # Remove verification token
        await db.email_verification_tokens.delete_one({"_id": token_doc["_id"]})
        
        return {"message": "Email verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying email: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
