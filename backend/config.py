import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database
MONGO_URL = os.environ.get('MONGO_URL', "mongodb://localhost:27017")
DB_NAME = os.environ.get('DB_NAME', "test_database")

# Security
JWT_SECRET = os.environ.get('JWT_SECRET', 'mystic-host-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Third Party
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')

# AMP
AMP_BASE_URL = os.environ.get('AMP_BASE_URL')
AMP_USERNAME = os.environ.get('AMP_USERNAME')
AMP_PASSWORD = os.environ.get('AMP_PASSWORD')
