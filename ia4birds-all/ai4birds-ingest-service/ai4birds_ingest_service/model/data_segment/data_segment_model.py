
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.data_segment.data_segment import DataSegment

class DataSegmentModel:

    def add(self, dataSegment:DataSegment) -> bool:
        segment_query = """
            INSERT INTO segment_data (camera_id, segment_idx, colatitude, azimuth, zoom_level, average_area, total_big_birds, frames, received_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s);
        """
        segment_values = (dataSegment.camera_id, dataSegment.segment_idx, dataSegment.colatitude, dataSegment.azimuth, dataSegment.zoom_level, dataSegment.average_area, dataSegment.total_big_birds, dataSegment.frames, dataSegment.received_at)

        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            database.execute(segment_query, segment_values)
            logger.info(f'Inserted segment data to DB successfully, with values: {segment_values}')
            result = True
        except Exception as e:
            logger.error(f"Error adding DataSegment to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def fetch_content(self, id: int) -> object:
        query = """SELECT * FROM segment_data WHERE camera_id = %s ORDER BY received_at DESC LIMIT 1; """
        values = (id,)
        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = database.fetchone()

            if result:
                column_names = [column[0] for column in database.cur.description]
                row = dict(zip(column_names, result))

                segment_data = DataSegment(
                    camera_id = row['camera_id'],
                    segment_idx = row['segment_idx'],
                    colatitude = row['colatitude'],
                    azimuth = row['azimuth'],
                    zoom_level = row['zoom_level'],
                    average_area = row['average_area'],
                    total_big_birds = row['total_big_birds'],
                    frames = row['frames'],
                    received_at = row['received_at']
                )
                segment_data.id = row['id']
                segment_data = segment_data.to_dict()
            else:
                segment_data = {}
        except Exception as e:
            logger.error(f"Error fectch content in DataSegment to DB: {e}") 
            segment_data = None
        finally:
            database.close()
        return segment_data