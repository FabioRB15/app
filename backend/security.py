import jwt
import bcrypt
import logging
from datetime import datetime, timedelta
import secrets
import string
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient

from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS, MONGO_URL, DB_NAME
from models import User

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security Scheme
security = HTTPBearer(auto_error=False)

# Database Connection (shared for dependency injection if needed)
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

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
