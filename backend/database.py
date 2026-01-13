from motor.motor_asyncio import AsyncIOMotorClient
from models import GameServer, PricingPlan, Testimonial, SupportRequest
from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class Database:
    @staticmethod
    async def initialize_data():
        """Initialize database with sample data if collections are empty"""
        
        # Initialize Game Servers
        servers_count = await db.game_servers.count_documents({})
        if servers_count == 0:
            initial_servers = [
                {
                    "name": "Minecraft Java",
                    "players": "2-100",
                    "price": "R$ 15,90",
                    "ram": "2GB",
                    "storage": "10GB SSD",
                    "status": "online",
                    "image": "https://image.api.playstation.com/vulcan/img/rnd/202010/2217/LsaRvLF262saMfevmiNqSuLL.jpg",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "name": "Counter-Strike 2",
                    "players": "2-64",
                    "price": "R$ 24,90",
                    "ram": "4GB",
                    "storage": "15GB SSD",
                    "status": "online",
                    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "name": "Rust",
                    "players": "2-200",
                    "price": "R$ 39,90",
                    "ram": "8GB",
                    "storage": "25GB SSD",
                    "status": "online",
                    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "name": "ARK Survival",
                    "players": "2-50",
                    "price": "R$ 29,90",
                    "ram": "6GB",
                    "storage": "20GB SSD",
                    "status": "maintenance",
                    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            for server_data in initial_servers:
                server = GameServer(**server_data)
                await db.game_servers.insert_one(server.dict())
        
        # Initialize Pricing Plans
        plans_count = await db.pricing_plans.count_documents({})
        if plans_count == 0:
            initial_plans = [
                {
                    "name": "Apprentice",
                    "price": "R$ 19,90",
                    "period": "/mês",
                    "description": "Perfeito para começar sua jornada",
                    "features": [
                        "2GB RAM",
                        "15GB SSD",
                        "Até 20 jogadores",
                        "Suporte básico",
                        "Backup diário"
                    ],
                    "popular": False,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "Sorcerer",
                    "price": "R$ 39,90",
                    "period": "/mês",
                    "description": "Para comunidades em crescimento",
                    "features": [
                        "4GB RAM",
                        "30GB SSD",
                        "Até 50 jogadores",
                        "Suporte prioritário",
                        "Backup a cada 6h",
                        "DDoS Protection"
                    ],
                    "popular": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "Archmage",
                    "price": "R$ 79,90",
                    "period": "/mês",
                    "description": "Máximo poder para grandes servidores",
                    "features": [
                        "8GB RAM",
                        "60GB SSD",
                        "Jogadores ilimitados",
                        "Suporte dedicado 24/7",
                        "Backup em tempo real",
                        "DDoS Protection Premium",
                        "CPU dedicado"
                    ],
                    "popular": False,
                    "created_at": datetime.utcnow()
                }
            ]
            
            for plan_data in initial_plans:
                plan = PricingPlan(**plan_data)
                await db.pricing_plans.insert_one(plan.dict())
        
        # Initialize Testimonials
        testimonials_count = await db.testimonials.count_documents({})
        if testimonials_count == 0:
            initial_testimonials = [
                {
                    "name": "Pedro Silva",
                    "role": "Admin do servidor MineCraft Brasil",
                    "content": "O Mystic Host transformou completamente nossa experiência. Performance impecável e suporte incrível!",
                    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    "rating": 5,
                    "approved": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "Ana Costa",
                    "role": "Líder da guild Dragons",
                    "content": "Melhor investimento que fizemos. Nossos jogadores nunca mais reclamaram de lag ou instabilidade.",
                    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=100&h=100&fit=crop&crop=face",
                    "rating": 5,
                    "approved": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "João Santos",
                    "role": "Streamer e Gamer",
                    "content": "Interface super intuitiva e performance que impressiona. Recomendo para qualquer comunidade séria.",
                    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                    "rating": 5,
                    "approved": True,
                    "created_at": datetime.utcnow()
                }
            ]
            
            for testimonial_data in initial_testimonials:
                testimonial = Testimonial(**testimonial_data)
                await db.testimonials.insert_one(testimonial.dict())
    
    @staticmethod
    async def get_dashboard_stats():
        """Calculate real-time dashboard statistics"""
        # Count active servers
        active_servers = await db.game_servers.count_documents({"status": "online"})
        total_servers = await db.game_servers.count_documents({})
        
        # Simulate player count (in real app, this would come from game server APIs)
        player_count = active_servers * 47 + (active_servers * 23)  # Rough calculation
        
        # Calculate uptime percentage
        uptime_percentage = (active_servers / max(total_servers, 1)) * 100
        
        # Simulate latency (in real app, this would come from monitoring)
        avg_latency = 12  # ms
        
        stats = [
            {
                "title": "Servidores Ativos",
                "value": str(active_servers),
                "change": "+12%",
                "trend": "up"
            },
            {
                "title": "Jogadores Online",
                "value": f"{player_count:,}".replace(",", "."),
                "change": "+8%",
                "trend": "up"
            },
            {
                "title": "Uptime Médio",
                "value": f"{uptime_percentage:.1f}%",
                "change": "+0.1%",
                "trend": "up"
            },
            {
                "title": "Latência Média",
                "value": f"{avg_latency}ms",
                "change": "-3ms",
                "trend": "down"
            }
        ]
        
        return stats