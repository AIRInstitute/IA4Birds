from ai4birds_ingest_service.model.db import db


class DataCombinationModel:

    def add(self, dataCombination) -> bool:
        query = ""

        values = ()
        database = db.PostgresSingleton.getInstance()
        database.connect()
        try:
            database.execute(query,values)
            result = True
        except Exception as e:
            print(f"Error adding DataCombination to DB: {e}")
            result = False
        finally:
            database.close()

        return result
    
    def fetch_content(self, id: int) -> object:
        query = """SELECT * FROM species WHERE id = ?"""
        values = (id,)
        database = db.PostgresSingleton.getInstance()
        database.connect()

        try:
            database.execute(query, values)
            result = True
        except Exception as e:
            print(f"Error fectch content in DataCombination to DB: {e}") 
            result = False
        finally:
            database.close()
        return result