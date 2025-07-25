
import json
from datetime import datetime
from ai4birds_ingest_service import logger

from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.bird_statistics.bird_statistics import BirdStatistics
from ai4birds_ingest_service.model.data_segment.data_segment import DataSegment

class BirdStatisticsModel:

    def add_statistics(self, birdStatistics:BirdStatistics) -> bool:
        new_statistics_query = """
            INSERT INTO bird_statistics (camera_id, bird_name, count, last_seen, created_at)
                VALUES (%s,%s,%s,%s,%s);
        """
        statistics_values = (birdStatistics.camera_id, birdStatistics.bird_name, birdStatistics.count, birdStatistics.last_seen, birdStatistics.created_at)

        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            database.execute(new_statistics_query, statistics_values)
            logger.info(f'Inserted birds statistics data to DB successfully')
            result = True
        except Exception as e:
            logger.error(f"Error adding DataSegment to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def update_statistics(self, birdStatistics:BirdStatistics) -> bool:
        update_statistics_query = """
            UPDATE bird_statistics SET count = %s, last_seen = %s
                WHERE camera_id = %s AND bird_name = %s;
        """
        statistics_values = (birdStatistics.count, birdStatistics.last_seen, birdStatistics.camera_id, birdStatistics.bird_name)

        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            database.execute(update_statistics_query, statistics_values)
            logger.info(f'Updated birds statistics data to DB successfully')
            result = True
        except Exception as e:
            logger.error(f"Error updating birds statistics data to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def fetch_content(self, id: str, bird_name:str) -> object:
        query = """SELECT * FROM bird_statistics WHERE camera_id = %s AND bird_name = %s ORDER BY last_seen DESC LIMIT 1;"""
        values = (id, bird_name,)
        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = database.fetchone()

            if result:
                column_names = [column[0] for column in database.cur.description]
                row = dict(zip(column_names, result))

                statistics_data = BirdStatistics(
                    camera_id = row['camera_id'],
                    bird_name = row['bird_name'],
                    count = row['count'],
                    last_seen = row['last_seen'],
                    created_at = row['created_at']
                )
                statistics_data.id = row['id']
                statistics_data = statistics_data.to_dict()
            else:
                statistics_data = {}
        except Exception as e:
            logger.error(f"Error fectch content in birds statistics to DB: {e}") 
            statistics_data = None
        finally:
            database.close()
        return statistics_data
    
    def fetch_content_by_camera(self, camera_id: str) -> object:
        query = """SELECT * FROM bird_statistics WHERE camera_id = %s ORDER BY last_seen DESC;"""
        values = (camera_id,)

        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = database.fetchall()

            if result:
                column_names = [column[0] for column in database.cur.description]
                
                statistics_data = []
                for row in result:
                    row_dict = dict(zip(column_names, row))

                    statistics = BirdStatistics(
                        camera_id = row_dict['camera_id'],
                        bird_name = row_dict['bird_name'],
                        count = row_dict['count'],
                        last_seen = row_dict['last_seen'],
                        created_at = row_dict['created_at']
                    )
                    statistics.id = row_dict['id']
                    statistics_data.append(statistics.to_dict())
            else:
                statistics_data = {}
        except Exception as e:
            logger.error(f"Error fectch content in bird statistics to DB: {e}") 
            statistics_data = None
        finally:
            database.close()
        return statistics_data
    
    
    def process_statistics(self, segment_obj:DataSegment) -> None:
        """
        Processes segment data to update bird statistics.
        segment_obj: DataSegment object

        returns: None
        """

        camera_id = segment_obj.camera_id
        timestamp = datetime.now()
        
        try:
            frames = json.loads(segment_obj.frames)
            
            for frame_data in frames.values():
                for detection in frame_data:
                    distances = detection.get('distances', {})
                    
                    for bird_name in distances:
                        try:
                            #check if bird name exists in bird statistics
                            existing_bird = self.fetch_content(camera_id, bird_name)

                            if existing_bird:
                                new_count = existing_bird["count"] + 1
                                stats = BirdStatistics(
                                    camera_id = camera_id,
                                    bird_name = bird_name,
                                    count = new_count,
                                    last_seen = timestamp,
                                    created_at = existing_bird["created_at"]
                                )
                                self.update_statistics(stats)
                            else:
                                stats = BirdStatistics(
                                    camera_id = camera_id,
                                    bird_name = bird_name,
                                    count = 1,
                                    last_seen = timestamp,
                                    created_at = timestamp
                                )
                                self.add_statistics(stats)

                        except Exception as e:
                            logger.error(f'Error processing bird statistics for bird: "{bird_name}": {e}')

        except Exception as e:
            logger.error(f'Error processing statistics data: {e}')