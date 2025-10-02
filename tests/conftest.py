"""
Pytest configuration and fixtures for Mystic Host tests
"""
import pytest
import asyncio
import os
import sys
from unittest.mock import AsyncMock, patch

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_database():
    """Mock database for testing"""
    with patch('server.db') as mock_db:
        # Setup mock collections
        mock_db.users = AsyncMock()
        mock_db.game_servers = AsyncMock()
        mock_db.pricing_plans = AsyncMock()
        mock_db.testimonials = AsyncMock()
        mock_db.support_requests = AsyncMock()
        mock_db.dashboard_stats = AsyncMock()
        
        yield mock_db

@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "id": "test_user_id",
        "name": "Test User",
        "email": "test@example.com",
        "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiLYyl3UhhYK",  # hashed "password123"
        "email_verified": True,
        "created_at": "2024-01-01T00:00:00Z"
    }

@pytest.fixture  
def sample_server_data():
    """Sample server data for testing"""
    return {
        "id": "test_server_id",
        "name": "Test Minecraft Server", 
        "players": "1-100",
        "price": "R$ 15,90",
        "ram": "4GB",
        "storage": "20GB SSD",
        "status": "online",
        "image": "minecraft.jpg"
    }

@pytest.fixture
def sample_support_request():
    """Sample support request for testing"""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Support Request",
        "message": "This is a test support message",
        "priority": "medium"
    }