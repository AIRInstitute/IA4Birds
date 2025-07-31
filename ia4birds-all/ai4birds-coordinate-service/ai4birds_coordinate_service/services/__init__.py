from .bird_data_service import BirdDataService
from .map_service import MapService
from .device_service import DeviceService
from .mqtt_service import MqttService
from .statistics_service import StatisticsService

# Initialize service instances for global use
bird_data_service = BirdDataService()
map_service = MapService()
device_service = DeviceService()
mqtt_service = MqttService()
statistics_service = StatisticsService()