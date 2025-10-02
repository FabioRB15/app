"""
Test Pydantic models and data validation
"""
import pytest
from pydantic import ValidationError
from datetime import datetime
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from models import (
    UserCreate, UserLogin, GameServerCreate, PricingPlanCreate,
    SupportRequestCreate, TestimonialCreate
)


class TestUserModels:
    """Test user-related models"""
    
    def test_valid_user_create(self):
        """Test valid user creation data"""
        user_data = {
            "name": "John Doe",
            "email": "john@example.com", 
            "password": "securepassword123"
        }
        user = UserCreate(**user_data)
        assert user.name == "John Doe"
        assert user.email == "john@example.com"
        assert user.password == "securepassword123"
        
    def test_invalid_email_format(self):
        """Test invalid email format validation"""
        with pytest.raises(ValidationError):
            UserCreate(
                name="John Doe",
                email="invalid-email", 
                password="password123"
            )
            
    def test_missing_required_fields(self):
        """Test missing required fields"""
        with pytest.raises(ValidationError):
            UserCreate(name="John Doe")  # Missing email and password
            
    def test_empty_password(self):
        """Test empty password validation"""
        with pytest.raises(ValidationError):
            UserCreate(
                name="John Doe",
                email="john@example.com",
                password=""
            )
            
    def test_valid_user_login(self):
        """Test valid login data"""
        login_data = {
            "email": "john@example.com",
            "password": "password123" 
        }
        login = UserLogin(**login_data)
        assert login.email == "john@example.com"
        assert login.password == "password123"


class TestGameServerModels:
    """Test game server models"""
    
    def test_valid_server_create(self):
        """Test valid server creation"""
        server_data = {
            "name": "Minecraft Java",
            "players": "1-100", 
            "price": "R$ 15,90",
            "ram": "4GB",
            "storage": "20GB SSD",
            "image": "minecraft.jpg"
        }
        server = GameServerCreate(**server_data)
        assert server.name == "Minecraft Java"
        assert server.players == "1-100"
        assert server.price == "R$ 15,90"
        
    def test_missing_server_fields(self):
        """Test missing required server fields"""
        with pytest.raises(ValidationError):
            GameServerCreate(name="Test Server")  # Missing other required fields


class TestPricingPlanModels:
    """Test pricing plan models"""
    
    def test_valid_pricing_plan(self):
        """Test valid pricing plan creation"""
        plan_data = {
            "name": "Basic Plan",
            "price": "R$ 19,90",
            "period": "/mês", 
            "description": "Basic hosting plan",
            "features": ["2GB RAM", "10GB Storage", "24/7 Support"],
            "popular": False
        }
        plan = PricingPlanCreate(**plan_data)
        assert plan.name == "Basic Plan"
        assert plan.price == "R$ 19,90"
        assert len(plan.features) == 3
        assert plan.popular is False
        
    def test_empty_features_list(self):
        """Test pricing plan with empty features"""
        plan_data = {
            "name": "Basic Plan", 
            "price": "R$ 19,90",
            "period": "/mês",
            "description": "Basic plan",
            "features": [],
            "popular": False
        }
        plan = PricingPlanCreate(**plan_data)
        assert len(plan.features) == 0


class TestSupportRequestModels:
    """Test support request models"""
    
    def test_valid_support_request(self):
        """Test valid support request"""
        request_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Server Issue", 
            "message": "I'm having trouble with my server setup."
        }
        request = SupportRequestCreate(**request_data)
        assert request.name == "John Doe"
        assert request.email == "john@example.com"
        assert request.subject == "Server Issue"
        assert request.message == "I'm having trouble with my server setup."
        
    def test_support_request_with_priority(self):
        """Test support request with priority"""
        request_data = {
            "name": "John Doe",
            "email": "john@example.com", 
            "subject": "Urgent Issue",
            "message": "Critical server problem",
            "priority": "high"
        }
        request = SupportRequestCreate(**request_data)
        assert request.priority == "high"
        
    def test_invalid_support_email(self):
        """Test support request with invalid email"""
        with pytest.raises(ValidationError):
            SupportRequestCreate(
                name="John Doe",
                email="invalid-email",
                subject="Test",
                message="Test message"
            )


class TestTestimonialModels:
    """Test testimonial models"""
    
    def test_valid_testimonial(self):
        """Test valid testimonial creation"""
        testimonial_data = {
            "name": "Jane Smith",
            "role": "Server Admin",
            "content": "Great service, highly recommend!",
            "rating": 5
        }
        testimonial = TestimonialCreate(**testimonial_data)
        assert testimonial.name == "Jane Smith"
        assert testimonial.role == "Server Admin" 
        assert testimonial.rating == 5
        
    def test_invalid_rating_range(self):
        """Test invalid rating values"""
        with pytest.raises(ValidationError):
            TestimonialCreate(
                name="Jane Smith",
                role="Admin", 
                content="Good service",
                rating=6  # Invalid rating > 5
            )
            
        with pytest.raises(ValidationError):
            TestimonialCreate(
                name="Jane Smith",
                role="Admin",
                content="Poor service", 
                rating=0  # Invalid rating < 1
            )
            
    def test_empty_testimonial_content(self):
        """Test testimonial with empty content"""
        with pytest.raises(ValidationError):
            TestimonialCreate(
                name="Jane Smith",
                role="Admin",
                content="",  # Empty content
                rating=5
            )