
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
            logger.info(f'Inserted heatmap data to DB successfully')
            result = True
        except Exception as e:
            logger.error(f"Error adding DataHeatmap to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def fetch_latest(self, camera_id: str) -> object:
        query = """SELECT * FROM heatmap_image WHERE camera_id = %s ORDER BY generated_at DESC LIMIT 1; """
        values = (camera_id,)
        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = database.fetchone()

            if result:
                column_names = [column[0] for column in database.cur.description]
                row = dict(zip(column_names, result))

                heatmap_data = DataHeatmap(
                    camera_id = row['camera_id'],
                    heatmap_for = row['heatmap_for'],
                    image_url = row['image_url'],
                    generated_at = row['generated_at']
                )
                heatmap_data.id = row['id']
                heatmap_data = heatmap_data.to_dict()
            else:
                heatmap_data = {}
        except Exception as e:
            logger.error(f"Error fectch content in DataHeatmap to DB: {e}") 
            heatmap_data = None
        finally:
            database.close()
        return heatmap_data