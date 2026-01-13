import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
if not mongo_url:
    print("MONGO_URL not found in environment variables")
    exit(1)

client = MongoClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test')]

# Update Minecraft image
minecraft_image = "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_600/v1/ncom/en_US/games/switch/m/minecraft-switch/hero"

result = db.game_servers.update_many(
    {"name": {"$regex": "Minecraft", "$options": "i"}},
    {"$set": {"image": minecraft_image}}
)

print(f"Updated {result.modified_count} Minecraft server images.")

# Verify other images if needed
servers = db.game_servers.find()
for server in servers:
    print(f"Server: {server.get('name')} - Image: {server.get('image')}")
