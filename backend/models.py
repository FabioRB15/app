from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# MongoDB Models using Pydantic

class GameServer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    players: str  # e.g., "2-100"
    price: str    # e.g., "R$ 15,90"
    ram: str      # e.g., "2GB"
    storage: str  # e.g., "10GB SSD"
    status: str = "online"  # "online" or "maintenance"
    image: str    # URL to game image
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GameServerCreate(BaseModel):
    name: str
    players: str
    price: str
    ram: str
    storage: str
    image: str

class GameServerUpdate(BaseModel):
    status: str

class PricingPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: str
    period: str = "/mês"
    description: str
    features: List[str]
    popular: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PricingPlanCreate(BaseModel):
    name: str
    price: str
    period: str = "/mês"
    description: str
    features: List[str]
    popular: bool = False

class DashboardStat(BaseModel):
    title: str
    value: str
    change: str
    trend: str  # "up" or "down"

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    content: str
    avatar: str
    rating: int = 5
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    role: str
    content: str
    avatar: str
    rating: int = 5

class SupportRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    priority: str = "medium"  # "low", "medium", "high"
    status: str = "open"      # "open", "in_progress", "resolved"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SupportRequestCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    priority: str = "medium"

# Response Models
class GameServerResponse(BaseModel):
    servers: List[GameServer]

class PricingPlanResponse(BaseModel):
    plans: List[PricingPlan]

class DashboardStatsResponse(BaseModel):
    stats: List[DashboardStat]

class TestimonialResponse(BaseModel):
    testimonials: List[Testimonial]

class SupportRequestResponse(BaseModel):
    message: str
    request_id: str

# User Authentication Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password_hash: Optional[str] = None  # None for social login users
    avatar: Optional[str] = None
    provider: str = "email"  # "email", "google", "facebook"
    provider_id: Optional[str] = None  # ID from social provider
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SocialLoginData(BaseModel):
    provider: str  # "google" or "facebook"
    id: str        # Provider user ID
    name: str
    email: str
    picture: Optional[str] = None
    token: str     # Provider access token

class AuthResponse(BaseModel):
    user: User
    token: str
    message: str