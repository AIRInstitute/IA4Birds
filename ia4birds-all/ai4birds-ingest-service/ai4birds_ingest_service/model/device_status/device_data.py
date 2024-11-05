from typing import Dict, Any

# Clase que representa los datos del dispositivo

class DeviceData:
    def __init__(self, gps_latitude: float, gps_longitude: float, status: str, storage_status: float, last_update: str):
        self.gps_latitude = gps_latitude
        self.gps_longitude = gps_longitude
        self.status = status
        self.storage_status = storage_status
        self.last_update = last_update

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'DeviceData':
        return DeviceData(
            gps_latitude=data['gps_latitude'],
            gps_longitude=data['gps_longitude'],
            status=data['status'],
            storage_status=data['storage_status'],
            last_update=data['last_update']
        )
