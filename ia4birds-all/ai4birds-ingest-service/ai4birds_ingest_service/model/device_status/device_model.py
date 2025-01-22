from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.device_status.device_data import DeviceData
from ai4birds_ingest_service import logger
from datetime import datetime

class DeviceModel:
    def add(self, device_data: DeviceData) -> bool:
        """
        Inserts the device data into the device_status table in the database.

        Args:
            device_data (DeviceData): The data of the device to be added.

        Returns:
            bool: True if the data was added successfully, False otherwise.
        """
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            # Insertar estado del dispositivo
            device_query = """
            INSERT INTO device_status (gps_latitude, gps_longitude, status, storage_status, last_update)
            VALUES (%s, %s, %s, %s, %s);
            """
            device_values = (device_data.gps_latitude, device_data.gps_longitude, device_data.status, device_data.storage_status, device_data.last_update)
            database.execute(device_query, device_values)

            database.commit()
            return True
        except Exception as e:
            print(f"Error adding device data to DB: {e}")
            database.rollback()
            return False
        finally:
            database.close()

    def fetch_latest_status(self) -> DeviceData:
        """
        Retrieves the latest device status from the device_status table.

        Args:
            None

        Returns:
            DeviceData: The latest device status data, or None if no data is found.
        """
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            query = """
            SELECT gps_latitude, gps_longitude, status, storage_status, last_update
            FROM device_status
            ORDER BY last_update DESC
            LIMIT 1;
            """
            result = database.execute(query).fetchone()
            if result:
                return DeviceData(
                    gps_latitude=result[0],
                    gps_longitude=result[1],
                    status=result[2],
                    storage_status=result[3],
                    last_update=result[4]
                )
            return None
        except Exception as e:
            print(f"Error fetching latest device status from DB: {e}")
            return None
        finally:
            database.close()

    def check_health(self, threshold_hours: int = 24) -> str:
        """
        Checks if the latest device status is within the health threshold.

        Args:
            threshold_hours (int): The time threshold in hours to check the health status.

        Returns:
            str: "OK" if the latest message is received within the threshold, 
                "ERROR" if it exceeds the threshold, or "NO DATA" if no data is available.
        """
        latest_status = self.fetch_latest_status()
        if latest_status:
            current_time = datetime.utcnow()
            last_update_time = latest_status.last_update
            
            # Calcular la diferencia en horas
            time_difference = (current_time - last_update_time).total_seconds() / 3600
            
            if time_difference < threshold_hours:
                return "OK"  # Último mensaje recibido dentro del tiempo permitido
            else:
                return "ERROR"  # Último mensaje recibido fuera del tiempo permitido
        return "NO DATA"  # No hay datos en la base de datos

