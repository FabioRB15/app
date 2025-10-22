from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
import bcrypt
from datetime import datetime, timedelta
import secrets
import string
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Import models and database
from models import (
    GameServer, GameServerCreate, GameServerUpdate, GameServerResponse,
    PricingPlan, PricingPlanCreate, PricingPlanResponse,
    DashboardStat, DashboardStatsResponse,
    Testimonial, TestimonialCreate, TestimonialResponse,
    SupportRequest, SupportRequestCreate, SupportRequestResponse,
    User, UserCreate, UserLogin, SocialLoginData, AuthResponse,
    PasswordResetRequest, PasswordResetToken, PasswordResetConfirm,
    EmailVerificationToken, EmailVerificationRequest
)
from database import Database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'mystic-host-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security
security = HTTPBearer(auto_error=False)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Mystic Host API", description="Game hosting management API")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Utilities
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str, email: str) -> str:
    """Create a JWT token for user authentication"""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def generate_reset_token() -> str:
    """Generate a secure random token for password reset"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(32))

def send_password_reset_email(email: str, token: str):
    """Send password reset email (mock implementation)"""
    # In production, you would use a real email service like SendGrid
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    print(f"📧 Mock Email: Password reset for {email}")
    print(f"🔗 Reset URL: {reset_url}")
    print("In production, this would send a real email.")
    return True

def send_verification_email(email: str, token: str):
    """Send email verification email (mock implementation)"""
    # In production, you would use a real email service
    verify_url = f"http://localhost:3000/verify-email?token={token}"
    print(f"📧 Mock Email: Email verification for {email}")
    print(f"🔗 Verify URL: {verify_url}")
    print("In production, this would send a real email.")
    return True

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    if not credentials:
        return None
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            return None
        
        # Get user from database
        user_doc = await db.users.find_one({"id": user_id})
        if not user_doc:
            return None
            
        return User(**user_doc)
    except jwt.PyJWTError:
        return None

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await Database.initialize_data()
    logger.info("Database initialized with sample data")

# Game Servers Endpoints
@api_router.get("/servers", response_model=GameServerResponse)
async def get_servers():
    """Get all game servers"""
    try:
        servers_cursor = db.game_servers.find()
        servers_list = await servers_cursor.to_list(1000)
        servers = [GameServer(**server) for server in servers_list]
        return GameServerResponse(servers=servers)
    except Exception as e:
        logger.error(f"Error fetching servers: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/servers", response_model=GameServer)
async def create_server(server_data: GameServerCreate):
    """Create a new game server"""
    try:
        server = GameServer(**server_data.dict())
        await db.game_servers.insert_one(server.dict())
        return server
    except Exception as e:
        logger.error(f"Error creating server: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/servers/{server_id}/status", response_model=GameServer)
async def update_server_status(server_id: str, status_update: GameServerUpdate):
    """Update server status"""
    try:
        result = await db.game_servers.update_one(
            {"id": server_id},
            {"$set": {"status": status_update.status, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Server not found")
        
        # Return updated server
        server_doc = await db.game_servers.find_one({"id": server_id})
        return GameServer(**server_doc)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating server status: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Pricing Plans Endpoints
@api_router.get("/pricing-plans", response_model=PricingPlanResponse)
async def get_pricing_plans():
    """Get all pricing plans"""
    try:
        plans_cursor = db.pricing_plans.find()
        plans_list = await plans_cursor.to_list(1000)
        plans = [PricingPlan(**plan) for plan in plans_list]
        return PricingPlanResponse(plans=plans)
    except Exception as e:
        logger.error(f"Error fetching pricing plans: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/pricing-plans", response_model=PricingPlan)
async def create_pricing_plan(plan_data: PricingPlanCreate):
    """Create a new pricing plan"""
    try:
        plan = PricingPlan(**plan_data.dict())
        await db.pricing_plans.insert_one(plan.dict())
        return plan
    except Exception as e:
        logger.error(f"Error creating pricing plan: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Dashboard Statistics Endpoint
@api_router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats():
    """Get real-time dashboard statistics"""
    try:
        stats = await Database.get_dashboard_stats()
        dashboard_stats = [DashboardStat(**stat) for stat in stats]
        return DashboardStatsResponse(stats=dashboard_stats)
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Testimonials Endpoints
@api_router.get("/testimonials", response_model=TestimonialResponse)
async def get_testimonials():
    """Get approved testimonials"""
    try:
        testimonials_cursor = db.testimonials.find({"approved": True})
        testimonials_list = await testimonials_cursor.to_list(1000)
        testimonials = [Testimonial(**testimonial) for testimonial in testimonials_list]
        return TestimonialResponse(testimonials=testimonials)
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial = Testimonial(**testimonial_data.dict())
        await db.testimonials.insert_one(testimonial.dict())
        return testimonial
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Support Endpoints
@api_router.post("/support/contact", response_model=SupportRequestResponse)
async def submit_support_request(request_data: SupportRequestCreate):
    """Submit a support request"""
    try:
        support_request = SupportRequest(**request_data.dict())
        await db.support_requests.insert_one(support_request.dict())
        
        return SupportRequestResponse(
            message="Support request submitted successfully",
            request_id=support_request.id
        )
    except Exception as e:
        logger.error(f"Error submitting support request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Authentication Endpoints
@api_router.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
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

@api_router.post("/auth/login", response_model=AuthResponse)
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

@api_router.post("/auth/social", response_model=AuthResponse)
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

@api_router.post("/auth/google", response_model=AuthResponse)
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
        GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
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

@api_router.get("/auth/verify")
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

@api_router.get("/auth/me")
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
@api_router.post("/auth/forgot-password")
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

@api_router.post("/auth/reset-password")
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
@api_router.post("/auth/resend-verification")
async def resend_verification_email(request_data: EmailVerificationRequest):
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

@api_router.get("/auth/verify-email/{token}")
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

# Root endpoint for health check
# ============= AMP Game Server Management Endpoints =============

from amp_client import get_amp_client, AMPAPIError
from pydantic import BaseModel as PydanticBaseModel

class ConsoleCommand(PydanticBaseModel):
    command: str

class CreateServerRequest(PydanticBaseModel):
    module: str
    instance_name: str
    friendly_name: str
    port_number: int = 25565

@api_router.get("/amp/instances")
async def get_amp_instances(current_user: User = Depends(get_current_user)):
    """Get list of all AMP instances/servers"""
    try:
        amp = get_amp_client()
        instances = amp.get_instances()
        return {
            "success": True,
            "message": f"Found {len(instances)} instances",
            "instances": instances
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch instances: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error fetching instances: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@api_router.get("/amp/instances/{instance_id}")
async def get_amp_instance_status(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed status of a specific instance"""
    try:
        amp = get_amp_client()
        status_data = amp.get_instance_status(instance_id)
        return {
            "success": True,
            "message": "Status retrieved successfully",
            "data": status_data
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get instance status: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@api_router.post("/amp/instances/{instance_id}/start")
async def start_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Start a stopped instance"""
    try:
        amp = get_amp_client()
        result = amp.start_instance(instance_id)
        return {
            "success": True,
            "message": "Instance start command sent",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start instance: {str(e)}"
        )

@api_router.post("/amp/instances/{instance_id}/stop")
async def stop_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Stop a running instance"""
    try:
        amp = get_amp_client()
        result = amp.stop_instance(instance_id)
        return {
            "success": True,
            "message": "Instance stop command sent",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to stop instance: {str(e)}"
        )

@api_router.post("/amp/instances/{instance_id}/restart")
async def restart_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Restart a running instance"""
    try:
        amp = get_amp_client()
        result = amp.restart_instance(instance_id)
        return {
            "success": True,
            "message": "Instance restart command sent",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to restart instance: {str(e)}"
        )

@api_router.get("/amp/instances/{instance_id}/console")
async def get_amp_console_output(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get recent console output from an instance"""
    try:
        amp = get_amp_client()
        output = amp.get_console_output(instance_id)
        return {
            "success": True,
            "message": "Console output retrieved",
            "entries": output
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get console output: {str(e)}"
        )

@api_router.post("/amp/instances/{instance_id}/console")
async def send_amp_console_command(
    instance_id: str,
    command: ConsoleCommand,
    current_user: User = Depends(get_current_user)
):
    """Send a command to the instance console"""
    try:
        amp = get_amp_client()
        result = amp.send_console_command(instance_id, command.command)
        return {
            "success": True,
            "message": "Command sent to console",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send console command: {str(e)}"
        )

@api_router.get("/amp/applications")
async def get_amp_applications(current_user: User = Depends(get_current_user)):
    """Get list of available games/applications"""
    try:
        amp = get_amp_client()
        apps = amp.get_available_applications()
        return {
            "success": True,
            "message": f"Found {len(apps) if isinstance(apps, list) else 0} applications",
            "applications": apps
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch applications: {str(e)}"
        )

@api_router.post("/amp/instances")
async def create_amp_instance(
    request: CreateServerRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new game server instance"""
    try:
        amp = get_amp_client()
        result = amp.create_instance(
            module=request.module,
            instance_name=request.instance_name,
            friendly_name=request.friendly_name,
            port_number=request.port_number
        )
        return {
            "success": True,
            "message": "Instance created successfully",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create instance: {str(e)}"
        )

@api_router.delete("/amp/instances/{instance_id}")
async def delete_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an instance permanently"""
    try:
        amp = get_amp_client()
        result = amp.delete_instance(instance_id)
        return {
            "success": True,
            "message": "Instance deleted successfully",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete instance: {str(e)}"
        )

# ============= End of AMP Endpoints =============

@api_router.get("/")
async def root():
    return {"message": "Mystic Host API is running", "status": "healthy"}

# Include the API router
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()