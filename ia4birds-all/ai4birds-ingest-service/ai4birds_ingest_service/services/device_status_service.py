from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.device_status.device_model import DeviceModel, DeviceData

logger = serve_application_logger()

class DeviceStatusService:
    """Service for handling device status operations."""
    
    def __init__(self):
        self.model = DeviceModel()
    
    def add_status(self, gps_latitude, gps_longitude, status, storage_status, last_update):
        """Add new device status entry.
        
        Args:
            gps_latitude (float): GPS latitude
            gps_longitude (float): GPS longitude
            status (str): Device status
            storage_status (float): Storage status in GB
            last_update (str): Last update timestamp
            
        Returns:
            tuple: Result message and status code
        """
        logger.info("Adding new device status")
        
        try:
            data = DeviceData(
                gps_latitude=gps_latitude,
                gps_longitude=gps_longitude,
                status=status,
                storage_status=storage_status,
                last_update=last_update
            )
            result = self.model.add(data)
            
            if result:
                return {"message": "Device status added successfully"}, 200
            else:
                return {"error": "Failed to add device status"}, 500
        except Exception as e:
            logger.error(f"Error adding device status: {e}")
            return {"error": f"Failed to add device status: {str(e)}"}, 500
    
    def get_latest_status(self):
        """Get latest device status.
        
        Returns:
            tuple: Latest status and status code
        """
        logger.info("Getting latest device status")
        
        try:
            data = self.model.fetch_latest_status()
            return (data, 200) if data else ({"error": "No data found"}, 404)
        except Exception as e:
            logger.error(f"Error retrieving latest device status: {e}")
            return {"error": f"Failed to retrieve latest device status: {str(e)}"}, 500
    
    def check_health(self):
        """Check device system health.
        
        Returns:
            dict: Health status
        """
        logger.info("Checking device system health")
        
        try:
            health_status = self.model.check_health()
            return {"health_status": health_status}, 200
        except Exception as e:
            logger.error(f"Error checking device health: {e}")
            return {"health_status": "error", "message": str(e)}, 500