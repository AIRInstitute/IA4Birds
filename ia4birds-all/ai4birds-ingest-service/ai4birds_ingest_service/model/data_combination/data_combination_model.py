from ai4birds_ingest_service.database.db import Database, get_database
from ai4birds_ingest_service.log import logger


class DataCombinationModel:

    def __init__(self, database: Database = None):
        """
        Initializes the model with a database instance.

        Args:
            database (Database, optional): A database instance for dependency injection.
                                           If None, a default one is created.
        """
        self.database = database or get_database()

    def add(self, data_combination: dict) -> bool:
        """
        Adds a new combined data record to the database.
        Assumes data_combination is a dictionary with relevant keys.
        """
        # NOTE: The query and values are placeholders and should be adapted
        # to your actual table structure and data_combination object.
        query = """
            INSERT INTO combined_data (species_code, ebird_url, xenocanto_url) 
            VALUES (%s, %s, %s)
        """
        values = (
            data_combination.get('speciesCode'), 
            data_combination.get('ebirdUrl'), 
            data_combination.get('xenoCantoUrl')
        )
        
        try:
            self.database.connect()
            self.database.execute(query, values)
            logger.info("Successfully added combined data.")
            return True
        except Exception as e:
            logger.error(f"Error adding DataCombination to DB: {e}")
            return False
        finally:
            self.database.close()

    def fetch_content(self, species_id: int) -> object:
        """
        Fetches a specific record from the combined_data table by its ID.
        """
        query = "SELECT * FROM combined_data WHERE id = %s"
        values = (species_id,)
        
        try:
            self.database.connect()
            self.database.execute(query, values)
            result = self.database.fetchone()
            return result
        except Exception as e:
            logger.error(f"Error fetching content from DataCombination in DB: {e}")
            return None