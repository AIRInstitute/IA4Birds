
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.data_heatmap.data_heatmap import DataHeatmap

class DataHeatmapModel:

    def add(self, dataHeatmap: DataHeatmap) -> bool:
        heatmap_query = """
            INSERT INTO heatmap_image (camera_id, heatmap_for, image_url, generated_at)
                VALUES (%s,%s,%s,%s);
        """
        heatmap_values = (dataHeatmap.camera_id, dataHeatmap.heatmap_for, dataHeatmap.image_url, dataHeatmap.generated_at)

        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            database.execute(heatmap_query, heatmap_values)
            logger.info(f'Inserted heatmap data to DB successfully, with values: {heatmap_values}')
            result = True
        except Exception as e:
            logger.error(f"Error adding DataHeatmap to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def fetch_latest(self, id: int) -> object:
        query = """SELECT * FROM heatmap_image WHERE id = ? ORDER BY generated_at DESC LIMIT 1; """
        values = (id,)
        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = database.fetchone()
        except Exception as e:
            logger.error(f"Error fectch content in DataHeatmap to DB: {e}") 
            result = None
        finally:
            database.close()
        return result