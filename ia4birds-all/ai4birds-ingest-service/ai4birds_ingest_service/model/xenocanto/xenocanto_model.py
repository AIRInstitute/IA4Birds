# xenocanto_model.py
from ai4birds_ingest_service.model.xenocanto.xenocanto_data import XenoCantoData
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.db import Database, PostgresDatabase

class XenoCantoModel:
    def __init__(self, database: Database = None):
        """
        Initializes the XenoCantoModel with a database instance.
        """
        self.database = database or PostgresDatabase()

    def add(self, xenocanto_data: XenoCantoData) -> bool:
        try:
            self.database.connect()
            # Suponiendo que ya tienes el ID de la observación, modificar según necesidad
            recording_query = """
            INSERT INTO recording (recordingId, location, quality, lat, lng, alt, file, fileName, time, date, observationId)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            for rec in xenocanto_data.recordings:
                recording_values = (rec['recordingId'], rec['location'], rec['quality'], rec['lat'], rec['lng'], rec['alt'], rec['file'], rec['fileName'], rec['time'], rec['date'], rec.get('observationId'))
                self.database.execute(recording_query, recording_values)

            self.database.commit()
            return True
        except Exception as e:
            print(f"Error adding XenoCanto data to DB: {e}")
            self.database.rollback()
            return False
        finally:
            self.database.close()

    def add_batch(self, xenocanto_data_list):
        try:
            self.database.connect()
            recording_values = []
            for xenocanto_data in xenocanto_data_list:
                for rec in xenocanto_data.recordings:
                    try:
                        # Corregir el nombre de clave y realizar conversiones
                        file_name = rec.get('fileName', rec.get('file-name', 'defaultFileName'))  # Soporte para ambos nombres de clave
                        lat = float(rec['lat']) if rec['lat'] else 0.0
                        lng = float(rec['lng']) if rec['lng'] else 0.0
                        alt = int(rec['alt']) if rec['alt'] else 0

                        # Añadir a la lista de valores
                        recording_values.append((
                            rec['recordingId'], rec['location'], rec['quality'], lat, lng, alt, rec['file'], 
                            file_name, rec['time'], rec['date'], rec.get('observationId')
                        ))
                    except KeyError as e:
                        logger.error(f"Key error {e} in data: {rec}")
                        continue  # Continúa con el siguiente registro
                    except ValueError as e:
                        logger.error(f"Value error {e} in data: {rec}")
                        continue  # Continúa si hay un error en la conversión de tipos

            # Consulta SQL para inserción en lote con manejo de conflictos
            recording_query = """
            INSERT INTO recording (recordingId, location, quality, lat, lng, alt, file, fileName, time, date, observationId)
                VALUES %s ON CONFLICT (recordingId) DO NOTHING;
            """
            # Utilizar execute_values del Singleton para realizar las inserciones
            if recording_values:  # Verificar si hay algo que insertar
                self.database.execute_values(recording_query, recording_values, page_size=100)
            return True
        except Exception as e:
            logger.error(f"Error adding XenoCanto batch data to DB: {e}")
            self.database.rollback()
            return False
        finally:
            self.database.close()

    def fetch_content(self, recording_id: str) -> XenoCantoData:
        try:
            self.database.connect()
            query = "SELECT * FROM recording WHERE recordingId = %s;"
            recording = self.database.execute(query, (recording_id,)).fetchone()
            if not recording:
                return None

            # Construcción de la respuesta
            recording_data = {
                'recordingId': recording[0], 'location': recording[1], 'quality': recording[2], 'lat': recording[3], 'lng': recording[4],
                'alt': recording[5], 'file': recording[6], 'fileName': recording[7], 'time': recording[8], 'date': recording[9]
            }
            return XenoCantoData(species_sci_name=recording['speciesSciName'], recordings=[recording_data])
        except Exception as e:
            print(f"Error fetching XenoCanto content from DB: {e}")
            return None
        finally:
            self.database.close()
