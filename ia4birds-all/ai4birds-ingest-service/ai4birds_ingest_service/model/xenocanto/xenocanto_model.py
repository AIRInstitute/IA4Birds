# xenocanto_model.py
from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.model.xenocanto.xenocanto_data import XenoCantoData
from ai4birds_ingest_service import logger

class XenoCantoModel:
    def add(self, xenocanto_data: XenoCantoData) -> bool:
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            # Suponiendo que ya tienes el ID de la observación, modificar según necesidad
            recording_query = """
            INSERT INTO recording (recordingId, location, quality, lat, lng, alt, file, fileName, time, date, observationId) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            for rec in xenocanto_data.recordings:
                recording_values = (rec['recordingId'], rec['location'], rec['quality'], rec['lat'], rec['lng'], rec['alt'], rec['file'], rec['fileName'], rec['time'], rec['date'], rec.get('observationId'))
                database.execute(recording_query, recording_values)

            database.commit()
            return True
        except Exception as e:
            print(f"Error adding XenoCanto data to DB: {e}")
            database.rollback()
            return False
        finally:
            database.close()

    def add_batch(self, xenocanto_data_list):
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            # Iniciar la transacción
            database.conn.begin()

            # Preparar los valores para las inserciones de grabaciones
            recording_values = []
            for xenocanto_data in xenocanto_data_list:
                for rec in xenocanto_data.recordings:
                    recording_values.append((
                        rec['recordingId'], rec['location'], rec['quality'], rec['lat'], rec['lng'], rec['alt'], rec['file'], 
                        rec['fileName'], rec['time'], rec['date'], rec.get('observationId', None)
                    ))
            
            # Consulta SQL para inserción en lote con manejo de conflictos
            recording_query = """
            INSERT INTO recording (recordingId, location, quality, lat, lng, alt, file, fileName, time, date, observationId)
            VALUES %s ON CONFLICT (recordingId) DO NOTHING;
            """
            # Utilizar execute_values del Singleton para realizar las inserciones
            database.execute_values(recording_query, recording_values, page_size=100)
            
            # Confirmar la transacción
            database.conn.commit()
            return True
        except Exception as e:
            print(f"Error adding XenoCanto batch data to DB: {e}")
            database.conn.rollback()
            return False
        finally:
            database.close()

    def fetch_content(self, recording_id: str) -> XenoCantoData:
        database = PostgresSingleton.getInstance()
        database.connect()
        try:
            query = "SELECT * FROM recording WHERE recordingId = %s;"
            recording = database.execute(query, (recording_id,)).fetchone()
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
            database.close()
