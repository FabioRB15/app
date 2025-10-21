"""
AMP (Application Management Panel) API Client
Handles authentication and communication with CubeCoders AMP API
"""

import requests
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AMPAPIError(Exception):
    """Custom exception for AMP API errors"""
    pass


class AMPClient:
    """
    AMP API Client for managing game servers.
    
    This client handles authentication, session management, and provides
    methods for all common AMP operations including instance management,
    server control, and status monitoring.
    """
    
    def __init__(self, base_url: str, username: str, password: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.username = username
        self.password = password
        self.timeout = timeout
        self.session_id: Optional[str] = None
        self.session_expiry: Optional[datetime] = None
        
        # Create requests session with default headers
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'text/javascript',  # AMP requires text/javascript!
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make a POST request to the AMP API with error handling.
        
        Args:
            endpoint: API endpoint path (e.g., 'Core/Login')
            data: Request payload as dictionary
            
        Returns:
            Response data as dictionary
            
        Raises:
            AMPAPIError: If request fails or returns error response
        """
        url = f"{self.base_url}/API/{endpoint}"
        
        try:
            response = self.session.post(url, json=data, timeout=self.timeout)
            response.raise_for_status()
            
            result = response.json()
            
            # Check for AMP-specific errors
            if isinstance(result, dict):
                if result.get('Title') == 'Unauthorized Access':
                    raise AMPAPIError(f"Unauthorized: {result.get('Message', 'Unknown error')}")
                elif 'Title' in result and result['Title'] not in ['Success', '']:
                    raise AMPAPIError(f"{result.get('Title')}: {result.get('Message', 'Unknown error')}")
            
            return result
            
        except requests.exceptions.Timeout:
            raise AMPAPIError(f"Request timeout after {self.timeout} seconds")
        except requests.exceptions.ConnectionError:
            raise AMPAPIError(f"Failed to connect to AMP server at {self.base_url}")
        except requests.exceptions.HTTPError as e:
            raise AMPAPIError(f"HTTP error: {e}")
        except Exception as e:
            raise AMPAPIError(f"Unexpected error: {str(e)}")
    
    def login(self) -> bool:
        """
        Authenticate with AMP and obtain session ID.
        
        Returns:
            True if login successful
            
        Raises:
            AMPAPIError: If login fails
        """
        logger.info(f"Logging in to AMP as {self.username}")
        
        result = self._make_request('Core/Login', {
            'username': self.username,
            'password': self.password,
            'token': '',
            'rememberMe': False
        })
        
        if result.get('success'):
            self.session_id = result.get('sessionID')
            # Set session expiry (AMP sessions typically last 24 hours)
            self.session_expiry = datetime.now() + timedelta(hours=23)
            logger.info("AMP login successful")
            return True
        else:
            raise AMPAPIError(f"Login failed: {result.get('message', 'Unknown error')}")
    
    def _ensure_authenticated(self):
        """Ensure we have a valid session, login if necessary."""
        if not self.session_id or (self.session_expiry and datetime.now() >= self.session_expiry):
            logger.info("Session expired or not established, logging in...")
            self.login()
    
    def _api_call(self, module: str, method: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """
        Make an authenticated API call.
        
        Args:
            module: API module name (e.g., 'Core', 'ADSModule')
            method: Method name (e.g., 'GetStatus')
            params: Optional parameters dictionary
            
        Returns:
            API response
        """
        self._ensure_authenticated()
        
        data = {'SESSIONID': self.session_id}
        if params:
            data.update(params)
        
        return self._make_request(f'{module}/{method}', data)
    
    # ============= Instance Management Methods =============
    
    def get_instances(self) -> List[Dict[str, Any]]:
        """
        Get list of all AMP instances.
        
        Returns:
            List of instance dictionaries containing instance details
        """
        logger.info("Fetching instance list from AMP")
        result = self._api_call('ADSModule', 'GetInstances')
        
        instances = []
        if isinstance(result, list):
            for target in result:
                if 'AvailableInstances' in target:
                    instances.extend(target['AvailableInstances'])
        
        logger.info(f"Found {len(instances)} instances")
        return instances
    
    def get_instance_status(self, instance_id: str) -> Dict[str, Any]:
        """
        Get detailed status of a specific instance.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Status dictionary with metrics and state information
        """
        logger.info(f"Getting status for instance {instance_id}")
        return self._api_call('Core', 'GetStatus', {'InstanceId': instance_id})
    
    def start_instance(self, instance_id: str) -> Dict[str, Any]:
        """
        Start a stopped instance.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Operation result
        """
        logger.info(f"Starting instance {instance_id}")
        return self._api_call('Core', 'Start', {'InstanceId': instance_id})
    
    def stop_instance(self, instance_id: str) -> Dict[str, Any]:
        """
        Stop a running instance.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Operation result
        """
        logger.info(f"Stopping instance {instance_id}")
        return self._api_call('Core', 'Stop', {'InstanceId': instance_id})
    
    def restart_instance(self, instance_id: str) -> Dict[str, Any]:
        """
        Restart a running instance.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Operation result
        """
        logger.info(f"Restarting instance {instance_id}")
        return self._api_call('Core', 'Restart', {'InstanceId': instance_id})
    
    def kill_instance(self, instance_id: str) -> Dict[str, Any]:
        """
        Force kill an instance (use with caution).
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Operation result
        """
        logger.info(f"Force killing instance {instance_id}")
        return self._api_call('Core', 'Kill', {'InstanceId': instance_id})
    
    # ============= Console Management Methods =============
    
    def send_console_command(self, instance_id: str, command: str) -> Dict[str, Any]:
        """
        Send a command to the instance console.
        
        Args:
            instance_id: The instance ID
            command: Console command to execute
            
        Returns:
            Command execution result
        """
        logger.info(f"Sending console command to {instance_id}: {command}")
        return self._api_call('Core', 'SendConsoleMessage', {
            'InstanceId': instance_id,
            'message': command
        })
    
    def get_console_output(self, instance_id: str) -> List[Dict[str, Any]]:
        """
        Get recent console output from an instance.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            List of console entries
        """
        logger.info(f"Getting console output for {instance_id}")
        result = self._api_call('Core', 'GetUpdates', {'InstanceId': instance_id})
        return result.get('ConsoleEntries', [])
    
    # ============= Application Management Methods =============
    
    def get_available_applications(self) -> List[Dict[str, Any]]:
        """
        Get list of applications/games that can be deployed.
        
        Returns:
            List of available application modules
        """
        logger.info("Fetching available applications from AMP")
        return self._api_call('ADSModule', 'GetApplicationEndpoints')
    
    def create_instance(
        self,
        module: str,
        instance_name: str,
        friendly_name: str,
        ip_binding: str = '0.0.0.0',
        port_number: int = 25565,
        admin_username: str = 'admin',
        admin_password: str = 'changeme'
    ) -> Dict[str, Any]:
        """
        Create a new game server instance.
        
        Args:
            module: Application module (e.g., 'Minecraft', 'GenericModule')
            instance_name: Internal instance name (no spaces)
            friendly_name: Display name for the instance
            ip_binding: IP address to bind to
            port_number: Primary port for the server
            admin_username: Admin username for the instance
            admin_password: Admin password for the instance
            
        Returns:
            Creation result with instance details
        """
        logger.info(f"Creating instance: {instance_name} ({module})")
        
        return self._api_call('ADSModule', 'CreateInstance', {
            'Module': module,
            'InstanceName': instance_name,
            'FriendlyName': friendly_name,
            'IPBinding': ip_binding,
            'PortNumber': port_number,
            'AdminUsername': admin_username,
            'AdminPassword': admin_password
        })
    
    def delete_instance(self, instance_id: str) -> Dict[str, Any]:
        """
        Delete an instance permanently.
        
        Args:
            instance_id: The instance ID
            
        Returns:
            Deletion result
        """
        logger.info(f"Deleting instance {instance_id}")
        return self._api_call('ADSModule', 'DeleteInstance', {'InstanceId': instance_id})
    
    # ============= Utility Methods =============
    
    def logout(self):
        """Logout and cleanup session."""
        if self.session_id:
            try:
                self._api_call('Core', 'Logout')
                logger.info("Logged out from AMP successfully")
            except Exception as e:
                logger.warning(f"Logout failed: {e}")
            finally:
                self.session_id = None
                self.session_expiry = None


# Singleton instance
_amp_client: Optional[AMPClient] = None


def get_amp_client() -> AMPClient:
    """Get or create the global AMP client instance."""
    global _amp_client
    
    if _amp_client is None:
        base_url = os.getenv('AMP_BASE_URL', 'http://146.235.55.253:8080')
        username = os.getenv('AMP_USERNAME', 'emergent')
        password = os.getenv('AMP_PASSWORD', 'emergent.sh')
        timeout = int(os.getenv('AMP_API_TIMEOUT', '30'))
        
        _amp_client = AMPClient(base_url, username, password, timeout)
        try:
            _amp_client.login()
        except AMPAPIError as e:
            logger.error(f"Failed to initialize AMP client: {e}")
            raise
    
    return _amp_client
