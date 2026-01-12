from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

from database import Database, client
from routers import auth, servers, general

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load Environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Mystic Host API", description="Game hosting management API")

# CORS middleware
# Security Note: In production, configure this to your specific frontend domain found in config.py
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await Database.initialize_data()
    logger.info("Database initialized with sample data")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(servers.router, prefix="/api")
app.include_router(general.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Mystic Host API is running", "status": "healthy"}

@app.get("/api")
async def api_root():
    return {"message": "Mystic Host API V1"}