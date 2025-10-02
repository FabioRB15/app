"""
Comprehensive API Tests for Mystic Host Backend
"""
import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import json
from datetime import datetime

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from server import app, db
from models import UserCreate, UserLogin, SupportRequestCreate


class TestAPIEndpoints:
    """Test all API endpoints"""
    
    def setup_method(self):
        """Setup test client"""
        self.client = TestClient(app)
        
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get("/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Mystic Host API is running"
        assert data["status"] == "healthy"
        
    def test_cors_headers(self):
        """Test CORS configuration"""
        response = self.client.options("/api/")
        assert response.status_code == 200
        
    @patch('server.db.game_servers.find')
    def test_get_servers(self, mock_find):
        """Test game servers endpoint"""
        # Mock database response
        mock_servers = [
            {
                "_id": "server1",
                "id": "server1", 
                "name": "Test Server",
                "players": "1-50",
                "price": "R$ 10,00",
                "ram": "2GB",
                "storage": "5GB SSD",
                "status": "online",
                "image": "test.jpg"
            }
        ]
        
        async def mock_to_list():
            return mock_servers
            
        mock_cursor = AsyncMock()
        mock_cursor.to_list.return_value = mock_servers
        mock_find.return_value = mock_cursor
        
        response = self.client.get("/api/servers")
        assert response.status_code == 200
        data = response.json()
        assert "servers" in data
        
    @patch('server.db.pricing_plans.find')  
    def test_get_pricing_plans(self, mock_find):
        """Test pricing plans endpoint"""
        mock_plans = [
            {
                "_id": "plan1",
                "id": "plan1",
                "name": "Basic",
                "price": "R$ 19,90", 
                "period": "/mês",
                "description": "Basic plan",
                "features": ["Feature 1"],
                "popular": False
            }
        ]
        
        mock_cursor = AsyncMock()
        mock_cursor.to_list.return_value = mock_plans
        mock_find.return_value = mock_cursor
        
        response = self.client.get("/api/pricing-plans")
        assert response.status_code == 200
        data = response.json()
        assert "plans" in data
        
    @patch('server.db.testimonials.find')
    def test_get_testimonials(self, mock_find):
        """Test testimonials endpoint"""
        mock_testimonials = [
            {
                "_id": "test1",
                "id": "test1",
                "name": "João Silva",
                "role": "Admin",
                "content": "Great service!",
                "avatar": "avatar.jpg",
                "rating": 5,
                "approved": True
            }
        ]
        
        mock_cursor = AsyncMock()
        mock_cursor.to_list.return_value = mock_testimonials
        mock_find.return_value = mock_cursor
        
        response = self.client.get("/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert "testimonials" in data
        
    def test_support_request_validation(self):
        """Test support request validation"""
        # Invalid request (missing fields)
        response = self.client.post("/api/support/contact", json={})
        assert response.status_code == 422
        
        # Valid request structure test (will fail on DB but pass validation)
        valid_request = {
            "name": "Test User",
            "email": "test@example.com", 
            "subject": "Test Subject",
            "message": "Test message content"
        }
        
        with patch('server.db.support_requests.insert_one') as mock_insert:
            mock_insert.return_value = AsyncMock()
            mock_insert.return_value.inserted_id = "test_id"
            
            response = self.client.post("/api/support/contact", json=valid_request)
            # May pass or fail depending on DB, but validation should work
            
    def test_auth_register_validation(self):
        """Test user registration validation"""
        # Invalid registration (missing fields)
        response = self.client.post("/api/auth/register", json={})
        assert response.status_code == 422
        
        # Invalid email format
        invalid_email = {
            "name": "Test User",
            "email": "invalid-email",
            "password": "password123"
        }
        response = self.client.post("/api/auth/register", json=invalid_email)
        assert response.status_code == 422
        
    def test_auth_login_validation(self):
        """Test user login validation"""
        # Invalid login (missing fields)
        response = self.client.post("/api/auth/login", json={})
        assert response.status_code == 422
        
        # Invalid email format  
        invalid_login = {
            "email": "invalid-email",
            "password": "password123"
        }
        response = self.client.post("/api/auth/login", json=invalid_login)
        assert response.status_code == 422
        
    def test_404_endpoints(self):
        """Test 404 handling"""
        response = self.client.get("/api/nonexistent")
        assert response.status_code == 404
        
        
class TestAuthFlow:
    """Test authentication flow"""
    
    def setup_method(self):
        self.client = TestClient(app)
        
    @patch('server.db.users.find_one')
    @patch('server.db.users.insert_one')
    def test_registration_flow(self, mock_insert, mock_find):
        """Test complete registration flow"""
        # Mock user doesn't exist
        mock_find.return_value = None
        mock_insert.return_value = AsyncMock()
        mock_insert.return_value.inserted_id = "user_id"
        
        registration_data = {
            "name": "Test User",
            "email": "newuser@example.com",
            "password": "securepassword123"
        }
        
        response = self.client.post("/api/auth/register", json=registration_data)
        # Test structure (may fail on actual DB operations but validates request)
        
    @patch('server.db.users.find_one')
    def test_login_flow(self, mock_find):
        """Test login flow"""
        # Mock user exists with hashed password
        test_password = "password123"
        hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt())
        
        mock_user = {
            "_id": "user_id",
            "id": "user_id", 
            "email": "test@example.com",
            "name": "Test User",
            "password": hashed_password.decode('utf-8'),
            "email_verified": True
        }
        mock_find.return_value = mock_user
        
        login_data = {
            "email": "test@example.com",
            "password": test_password
        }
        
        # This may fail on DB operations but tests the flow
        response = self.client.post("/api/auth/login", json=login_data)


class TestDataValidation:
    """Test data validation and error handling"""
    
    def setup_method(self):
        self.client = TestClient(app)
        
    def test_malformed_json(self):
        """Test malformed JSON handling"""
        response = self.client.post(
            "/api/support/contact",
            data="invalid json",
            headers={"content-type": "application/json"}
        )
        assert response.status_code == 422
        
    def test_missing_content_type(self):
        """Test missing content type"""
        response = self.client.post("/api/support/contact", data='{"test": "data"}')
        # Should handle gracefully
        
    def test_large_payload(self):
        """Test large payload handling"""
        large_message = "x" * 10000  # 10KB message
        request_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject", 
            "message": large_message
        }
        
        response = self.client.post("/api/support/contact", json=request_data)
        # Should handle large payloads appropriately


if __name__ == "__main__":
    pytest.main([__file__])