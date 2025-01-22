# ebird_model.py
from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.ebird.ebird_data import EBirdData
from ai4birds_ingest_service import logger

class EBirdModel:
    def add(self, ebird_data: EBirdData) -> bool:
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            # Insertar especie
            species_query = """
            INSERT INTO species (comName, sciName) VALUES (%s, %s) RETURNING id;
            """
            species_values = (ebird_data.com_name, ebird_data.sci_name)
            species_id = database.execute(species_query, species_values).fetchone()[0]

            # Insertar observaciones
            observation_query = """
            INSERT INTO observation (locationId, locationName, lat, lng, date, numObservation, speciesId) VALUES (%s, %s, %s, %s, %s, %s, %s);
            """
            for obs in ebird_data.observations:
                observation_values = (obs['locationId'], obs['locationName'], obs['lat'], obs['lng'], obs['date'], obs['numObservation'], species_id)
                database.execute(observation_query, observation_values)

            database.commit()
            return True
        except Exception as e:
            print(f"Error adding EBird data to DB: {e}")
            database.rollback()
            return False
        finally:
            database.close()

    def add_batch(self, ebird_data_list):
        database = PostgresSingleton.getInstance()
        database.connect()

        try:
            
            # Preparar los valores para la inserción de especies
            species_values = [(data.com_name, data.sci_name) for data in ebird_data_list]
           
            species_query = """
            INSERT INTO species (comName, sciName) VALUES %s ON CONFLICT (comName, sciName) DO NOTHING RETURNING id, comName, sciName;
            """
            database.execute_values(species_query, species_values, page_size=100)
            
            species_ids = database.fetchall()

            logger.info(f"Size of species_ids RETURN: {len(species_ids)}")
            # Crear un mapa de ID de especies basado en comName y sciName
            species_id_map = {name: id for id, name, _ in species_ids}

            logger.info(f"Size of species_id_map: {len(species_id_map)}")
            # Preparar datos de observaciones para inserción en lotes
            observation_values = []
            for data in ebird_data_list:
                specie_id = species_id_map.get((data.com_name, data.sci_name))
                for obs in data.observations:
                    observation_values.append(
                        (obs['locationId'], obs['locationName'], obs['lat'], obs['lng'], obs['date'], obs['numObservation'], specie_id))

            # Insertar observaciones en lotes
            
            observation_query = """
            INSERT INTO observation (locationId, locationName, lat, lng, date, numObservation, speciesId) VALUES %s;
            """
            database.execute_values(observation_query, observation_values, page_size=100)
            
            return True
        except Exception as e:
            print(f"Error in add_batch: {e}")
            database.rollback()
            return False
        finally:
            database.close()

    def fetch_content(self, species_id: int) -> EBirdData:
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            query = "SELECT * FROM species WHERE id = %s;"
            species = database.execute(query, (species_id,)).fetchone()
            if not species:
                return None
            
            query = "SELECT * FROM observation WHERE speciesId = %s;"
            observations = database.execute(query, (species_id,)).fetchall()
            formatted_observations = [{
                'locationId': obs[1], 'locationName': obs[2], 'lat': obs[3], 'lng': obs[4], 'date': obs[5], 'numObservation': obs[6]
            } for obs in observations]
            
            return EBirdData(species_code=species[0], com_name=species[1], sci_name=species[2], observations=formatted_observations)
        except Exception as e:
            print(f"Error fetching EBird content from DB: {e}")
            return None
        finally:
            database.close()
