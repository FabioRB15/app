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

updates = [
    {
        "name_regex": "Minecraft",
        "image": "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_600/v1/ncom/en_US/games/switch/m/minecraft-switch/hero"
    },
    {
        "name_regex": "Counter-Strike",
        "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"
    },
    {
        "name_regex": "Rust",
        "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg"
    },
    {
        "name_regex": "ARK",
        "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg"
    }
]

for update in updates:
    result = db.game_servers.update_many(
        {"name": {"$regex": update["name_regex"], "$options": "i"}},
        {"$set": {"image": update["image"]}}
    )
    print(f"Updated {update['name_regex']}: {result.modified_count} documents.")

# Verify
print("\nCurrent Server Images:")
servers = db.game_servers.find()
for server in servers:
    print(f"Server: {server.get('name')} - Image: {server.get('image')}")
