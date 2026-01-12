from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
import logging

from models import (
    GameServer, GameServerCreate, GameServerUpdate, GameServerResponse,
    User
)
from database import db
from security import get_current_user

# AMP Client
from amp_client import get_amp_client, AMPAPIError
from pydantic import BaseModel as PydanticBaseModel

router = APIRouter()
logger = logging.getLogger(__name__)

# Game Servers Endpoints
@router.get("/servers", response_model=GameServerResponse)
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

@router.post("/servers", response_model=GameServer)
async def create_server(server_data: GameServerCreate):
    """Create a new game server"""
    try:
        server = GameServer(**server_data.dict())
        await db.game_servers.insert_one(server.dict())
        return server
    except Exception as e:
        logger.error(f"Error creating server: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/servers/{server_id}/status", response_model=GameServer)
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


# ============= AMP Game Server Management Endpoints =============

class CreateServerRequest(PydanticBaseModel):
    module: str
    instance_name: str
    friendly_name: str
    port_number: int = 25565

@router.get("/amp/instances")
async def get_amp_instances(current_user: User = Depends(get_current_user)):
    """Get list of all AMP instances/servers"""
    try:
        amp = get_amp_client()
        instances = amp.get_instances()
        return {
            "success": True,
            "message": f"Found {len(instances)} instances",
            "instances": instances
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch instances: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error fetching instances: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/amp/instances/{instance_id}")
async def get_amp_instance_status(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed status of a specific instance"""
    try:
        amp = get_amp_client()
        status_data = amp.get_instance_status(instance_id)
        return {
            "success": True,
            "message": "Status retrieved successfully",
            "data": status_data
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get instance status: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/amp/instances/{instance_id}/start")
async def start_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Start a stopped instance"""
    try:
        amp = get_amp_client()
        result = amp.start_instance(instance_id)
        return {
            "success": True,
            "message": "Instance start command sent",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start instance: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/amp/instances/{instance_id}/stop")
async def stop_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Stop a running instance"""
    try:
        amp = get_amp_client()
        result = amp.stop_instance(instance_id)
        return {
            "success": True,
            "message": "Instance stop command sent",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to stop instance: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/amp/instances")
async def create_amp_instance(
    request: CreateServerRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new game server instance"""
    try:
        amp = get_amp_client()
        result = amp.create_instance(
            module=request.module,
            instance_name=request.instance_name,
            friendly_name=request.friendly_name,
            port_number=request.port_number
        )
        return {
            "success": True,
            "message": "Instance created successfully",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create instance: {str(e)}"
        )

@router.delete("/amp/instances/{instance_id}")
async def delete_amp_instance(
    instance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an instance permanently"""
    try:
        amp = get_amp_client()
        result = amp.delete_instance(instance_id)
        return {
            "success": True,
            "message": "Instance deleted successfully",
            "data": result
        }
    except AMPAPIError as e:
        logger.error(f"AMP API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete instance: {str(e)}"
        )
