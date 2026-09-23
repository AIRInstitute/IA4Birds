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
            INSERT INTO species (comName, sciName)
                VALUES (%s, %s) RETURNING id;
            """
            species_values = (ebird_data.com_name, ebird_data.sci_name)
            species_id = database.execute(species_query, species_values).fetchone()[0]

            # Insertar observaciones
            observation_query = """
            INSERT INTO observation (locationId, locationName, lat, lng, date, numObservation, speciesId)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
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

        if not database.conn or not database.cur:
            logger.error("Database connection failed, cannot proceed with insertion.")
            return False

        try:
            if not ebird_data_list:
                return True

            # Insertar especies nuevas (sin duplicados dentro del lote)
            species_values = list({(data.com_name, data.sci_name) for data in ebird_data_list})

            species_query = """
            INSERT INTO species (comName, sciName)
                VALUES %s
                    ON CONFLICT (comName, sciName) DO NOTHING;
            """
            database.execute_values(species_query, species_values, page_size=100)

            # RETURNING solo devuelve las filas nuevas: se consultan todas las del lote
            database.execute(
                "SELECT id, comName, sciName FROM species WHERE (comName, sciName) IN %s;",
                (tuple(species_values),))
            species_id_map = {(com_name, sci_name): id for id, com_name, sci_name in database.fetchall()}

            logger.info(f"Size of species_id_map: {len(species_id_map)}")
            # Preparar datos de observaciones para inserción en lotes
            observation_values = []
            skipped = 0
            for data in ebird_data_list:
                specie_id = species_id_map.get((data.com_name, data.sci_name))
                for obs in data.observations:
                    # (subId, speciesId) identifica la observación; sin ellos no se puede deduplicar
                    if specie_id is None or not obs.get('subId'):
                        skipped += 1
                        continue
                    observation_values.append(
                        (obs['locationId'], obs['locationName'], obs['lat'], obs['lng'], obs['date'], obs['numObservation'], specie_id, obs['subId']))

            if skipped:
                logger.warning(f"Skipped {skipped} observations without speciesId or subId")

            if observation_values:
                observation_query = """
                INSERT INTO observation (locationId, locationName, lat, lng, date, numObservation, speciesId, subId)
                    VALUES %s
                        ON CONFLICT (subId, speciesId) DO NOTHING;
                """
                database.execute_values(observation_query, observation_values, page_size=100)

            logger.info(f"Processed {len(observation_values)} eBird observations (existing ones ignored)")
            return True
        except Exception as e:
            logger.error(f"Error in add_batch: {e}")
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
