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

# Import models and database
from models import (
    GameServer, GameServerCreate, GameServerUpdate, GameServerResponse,
    PricingPlan, PricingPlanCreate, PricingPlanResponse,
    DashboardStat, DashboardStatsResponse,
    Testimonial, TestimonialCreate, TestimonialResponse,
    SupportRequest, SupportRequestCreate, SupportRequestResponse,
    User, UserCreate, UserLogin, SocialLoginData, AuthResponse
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
            is_verified=True  # Auto-verify for demo
        )
        
        # Save to database
        await db.users.insert_one(user.dict())
        
        # Create JWT token
        token = create_jwt_token(user.id, user.email)
        
        # Remove password hash from response
        user_response = user.dict()
        user_response.pop('password_hash', None)
        
        return AuthResponse(
            user=User(**user_response),
            token=token,
            message="User registered successfully"
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

# Root endpoint for health check
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

# Add missing import
from datetime import datetime

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()