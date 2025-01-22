import flask
import requests
from flask import send_file
import json, time
import os
from os import path
from flask import jsonify, send_from_directory
from flask import Response, request as flask_request
import tempfile
from flask_restx import Resource
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service.api.v1 import api 
from ai4birds_ingest_service.utils import handle400error, handle404error, handle500error
from ai4birds_ingest_service.core import cache, limiter
from ai4birds_ingest_service.api.models.ingest_models import windmap_model, exclusionmap_model, exclusionmap_response_model, device_status_model
from ai4birds_ingest_service.api.parsers.ingest_parsers import location_parser, exclusionmap_parser, exclusionmap_parser_get, device_status_parser
from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor
from ai4birds_ingest_service.model.extractor.windmap_extractor import WindMap_Extractor
from ai4birds_ingest_service.model.extractor.exclusionmap_extractor import ExclusionMap_extractor
from ai4birds_ingest_service.model.combination_data import combine_data
from ai4birds_ingest_service.model.data_converter import DataConverter
from ai4birds_ingest_service.model.data_combination.data_combination_model import DataCombinationModel
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel, EBirdData
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel, XenoCantoData
from ai4birds_ingest_service.model.device_status.device_model import DeviceModel, DeviceData



# Endpoints
ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
ns_windmap = api.namespace('windmap', description='Iberian wind map requests')
ns_exclusionmap = api.namespace('exclusionmap', description='Eolic exclusion map for CyL')
ns_sensitivity = api.namespace('sensitivity', description='Sensitivity of birds in the region of Castilla y Leon')
ns_dataBird = api.namespace('dataBird', description='Returns observations and recordings of birds in the region of Castilla y Leon')
ns_device_status = api.namespace('device-status', description='Device status operations')


# Crear instancias de los extractores
xenocanto_extractor = XenoCanto_Extractor()
ebird_extractor = EBird_Extractor()


@ns_dataBird.route('/')
class DataBird(Resource):
    
    def get(self):
        """
        Gets data from XenoCanto and eBird API in Castilla y León.

        Returns:
            :return: Combined data from XenoCanto and eBird API.
            :rtype: dict
        """
        
        max_retries = 3
        backoff_factor = 1
        ebird_data_raw = ebird_extractor.ebird_query(max_retries=max_retries, backoff_factor=backoff_factor)
        xenocanto_data = xenocanto_extractor.xenocanto_query(max_retries=max_retries, backoff_factor=backoff_factor)
        
        ebird_data_objects = [EBirdData.from_dict(item) for item in ebird_data_raw] if ebird_data_raw else []
        xenocanto_data_objects = [XenoCantoData.from_dict(item) for item in xenocanto_data] if xenocanto_data else []

        ebird_model = EBirdModel()
        xeno_model = XenoCantoModel()

        # if ebird_data_objects:
        #     if not ebird_model.add_batch(ebird_data_objects):
        #         return {"error": "Failed to insert eBird data into the database"}, 500

        # if xenocanto_data_objects:
        #     if not xeno_model.add_batch(xenocanto_data_objects):
        #         return {"error": "Failed to insert XenoCanto data into the database"}, 500

        print(xenocanto_extractor.xenocanto_query.cache_info())
        
        results = combine_data(data_ebird=ebird_data_raw, data_xenocanto=xenocanto_data) if ebird_data_raw and xenocanto_data else {"error": "Failed to retrieve data from one or both sources."}
        return results

    
@ns_xenocanto.route('/')
class XenoCanto(Resource):

    def get(self):
        """
        Gets data from XenoCanto API in Castilla y León.

        Returns:
            :return: Data from XenoCanto API.
            :rtype: dict
        """
        max_retries = 3
        backoff_factor = 1
        xenocanto_data_raw = xenocanto_extractor.xenocanto_query(max_retries=max_retries, backoff_factor=backoff_factor)

        if xenocanto_data_raw:
            # Crear instancias de XenoCantoData desde los datos brutos obtenidos
            xenocanto_data_objects = [XenoCantoData.from_dict(item) for item in xenocanto_data_raw]
            
            # Crear una instancia del modelo XenoCantoModel y utilizar add_batch
            xeno_model = XenoCantoModel()
            if not xeno_model.add_batch(xenocanto_data_objects):
                print("Error al insertar datos de XenoCanto en la base de datos")
                return {"error": "Failed to insert XenoCanto data into the database"}, 500

        print(xenocanto_extractor.xenocanto_query.cache_info())

        # Retornar los datos recuperados
        return xenocanto_data_raw

@ns_ebird.route('/')
class EBird(Resource):
    
    def get(self):
        """
        Gets data from the last 30 days in Castilla y León using eBird API.

        Returns:
            :return: Data from eBird API.
            :rtype: dict
        """
        
        max_retries = 3
        backoff_factor = 1
        # Llamar a los métodos de instancia
        ebird_data_raw = ebird_extractor.ebird_query(max_retries=max_retries, backoff_factor=backoff_factor)
        
        #Crear instancias de EBirdData desde los datos brutos obtenidos
        if ebird_data_raw is not None:
            ebird_data_objects = [EBirdData.from_dict(item) for item in ebird_data_raw]

            # Crear una instancia del modelo EBirdModel y utilizar add_batch
            ebird_model = EBirdModel()
            if not ebird_model.add_batch(ebird_data_objects):
                print("Error al insertar datos de eBird en la base de datos")
                return {"error": "Failed to insert eBird data into the database"}, 500
        else:
            return {"error": "No data retrieved from eBird API"}, 404
        
        print(ebird_extractor.ebird_query.cache_info())

        # Retornar datos recuperados 
        return ebird_data_raw

    
@ns_windmap.route('/')
class WindMap(Resource):

    @api.expect(windmap_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @limiter.limit('1000000/hour') 
    def post(self):
        """
        Obtain wind map data with coordinates.

        Returns:
            :return: Result of the wind map extraction.
            :rtype: dict
        """
        # retrieve arguments
        # try:
        #     obj = flask.request.get_json()
        # except:
        #     return handle400error(ns_windmap, 'Unable to retrieve arguments from request. Please, check the swagger documentation at /v1')

        # check parameters
        # try:
        #     params = location_parser.parse_args()
        # except:
        #     return handle400error(ns_windmap, 'Malformed request. Please, check the request at /v1')
        
        # retrieve arguments directly from JSON body
        data = flask.request.get_json(force=True)  # 'force=True' to ensure JSON format is parsed even if the content-type header is not set correctly
        if not data or 'lat' not in data or 'lon' not in data or 'z' not in data:
            return {"message": "Missing 'lat', 'lon', or 'z' in request body"}, 400

        try:
            extractor = WindMap_Extractor()
            result= extractor.windmap_ingest(lat = data['lat'], lon = data['lon'], z = data['z'])
        except:
            return handle500error(ns_windmap)
        return result

@ns_exclusionmap.route('/')
class ExclusionMap(Resource):

    @api.expect(exclusionmap_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=exclusionmap_response_model)
    @limiter.limit('1000000/hour') 
    #@cache.cached(timeout=180, query_string=True)
    def post(self):
        
        """
        Obtain exclusion map data with coordinates divided into pages.

        Returns:
            :return: Result of the exlusion map extraction.
            :rtype: dict
        """
        # retrieve arguments
        try:
            obj = flask.request.get_json()
        except:
            return handle400error(ns_exclusionmap, 'Unable to retrieve arguments from request. Please, check the swagger documentation at /v1')

        # check parameters
        try:
            params = exclusionmap_parser.parse_args()
        except:
            return handle400error(ns_exclusionmap, 'Malformed request. Please, check the request at /v1')
        
        
        try:
            page = params['page']
            page_size = params['page_size']
            csv_file_path = config.EXCLUSION_EOLICA_CSV_PATH
            if csv_file_path is None:
                logger.error("La ruta del archivo CSV no está definida en las variables de entorno.")
                raise Exception("CSV file path not defined.")
            else:
                json_data = DataConverter.csv_to_json(csv_file_path,page=page,page_size=page_size)
                if not json_data:  # Verificar si los datos JSON están vacíos (página fuera de rango)
                     return jsonify({"message": "Data not found for the specified page parameters"}), 404

                return jsonify(json_data)  # Usar jsonify para asegurar la serialización correcta
                
                # # Decidir qué método usar basado en una configuración o un parámetro
                # if csv_file_path.endswith('.gz'):
                #     result = DataConverter.csv_to_json_gzip(csv_file_path, page, page_size)
                # else:
                #     result = DataConverter.csv_to_json(csv_file_path, page, page_size)
                # return jsonify(result)
        except Exception as e:
            logger.error(f"Error: {e}")  # Asegúrate de loguear el error
            return jsonify({'error': str(e)}), 500  # Devolver como JSON
        

@ns_exclusionmap.route('/zip')
class ExclusionMapZip(Resource):
    
    def get(self):
        try:
            csv_file_path = config.EXCLUSION_EOLICA_CSV_PATH 
            # Obtener el path del archivo ZIP
            zip_path = DataConverter.csv_to_json_full(csv_file_path)
            
            if zip_path:
                # Enviar el archivo ZIP como respuesta
                #return send_file(zip_path, as_attachment=True, attachment_filename='data.zip', mimetype='application/zip')
                return send_file(zip_path, as_attachment=True, download_name='data.zip', mimetype='application/zip')

            else:
                return {"message": "No se pudo procesar el archivo."}, 500
        except Exception as e:
            # Asegúrate de manejar los errores adecuadamente...
            api.abort(500, f"Error interno: {e}")

@ns_exclusionmap.route('/stream-exclusion-data')
class StreamExclusionData(Resource):
    
    # @api.expect(stream_exclusionmap_model)
    @api.response(200, 'Successful')
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @limiter.limit('1000000/hour')
    def post(self):
        """
        Stream CSV data as server-sent events based on posted configuration.

        Returns:
            :return: A stream of server-sent events with CSV data batched.
            :rtype: Response
        """
        try:
            # params = stream_exclusionmap_parser.parse_args()
            csv_file_path = config.EXCLUSION_EOLICA_CSV_PATH
            client_id = flask_request.args.get('id', None)
            def generate():
                for data_batch in DataConverter.stream_csv_data(csv_file_path, page_size=50):
                    # yield f"data: {json.dumps(data_batch)}\n\n"
                    # # print(f"Data batch sent: {data_batch}")
                    #response = requests.post(f'http://212.128.141.36:5030/api/data/exclusionmap/stream-exclusion-data?client_id={client_id}', json=data_batch)
                    response = requests.post(f'http:{config.BACKEND_URL}/api/data/exclusionmap/stream-exclusion-data', json=data_batch)
                    if response.status_code == 200:
                        print(f"Successfully sent")
                    else:
                        print(f"Failed to send")

                    time.sleep(1)
            generate()
            return jsonify({"message": "Data streaming completed."})
            # return Response(generate(), mimetype='text/event-stream')

        except Exception as e:
            logger.error(f"Error during data streaming: {e}")
            return jsonify({'error': str(e)}), 500

@ns_sensitivity.route('/')
class Sensitivity(Resource):
    """
    Saves a file *.shp for the eolic exclusion map.

    Returns:
        :return: Message indicating the completion of the download.
        :rtype: str
    """
    
    def get(self):
        try:
            
            csv_file_path = config.CORRDENADAS_CSV_PATH
            
            if csv_file_path is None:
                logger.error("La ruta del archivo CSV no está definida en las variables de entorno.")
                raise
            else:
                json_data = DataConverter.csv_to_json_sensitivity(csv_file_path)
                return jsonify({'data': json_data})
        except:
            return handle500error(ns_sensitivity)

@ns_device_status.route('/')
class DeviceStatus(Resource):

    @api.expect(device_status_model)  
    @api.response(200, 'Device status added successfully')
    @api.response(400, 'Invalid input')
    @api.response(500, 'Internal server error')
    def post(self):
        """
        Adds a new device status to the database.

        Returns:
            :return: Message indicating successful addition.
            :rtype: str
        """
        # Recuperar argumentos
        try:
            data = flask.request.get_json(force=True)
        except Exception as e:
            return handle400error(ns_device_status, 'Unable to retrieve arguments from request. Please, check the documentation.')

        # Verificar parámetros
        try:
            params = device_status_parser.parse_args()  
        except Exception as e:
            return handle400error(ns_device_status, 'Malformed request. Please, check the request parameters.')

        # Crear el objeto de datos del dispositivo
        device_data = DeviceData(
            gps_latitude=params['gps_latitude'],
            gps_longitude=params['gps_longitude'],
            status=params['status'],
            storage_status=params['storage_status'],
            last_update=params['last_update']
        )

        device_model = DeviceModel()
        if device_model.add(device_data):
            return {"message": "Device status added successfully"}, 200
        else:
            return {"error": "Failed to add device status"}, 500



@ns_device_status.route('/latest')
class LatestDeviceStatus(Resource):

    @api.response(200, 'Successful', model=device_status_model)  
    @api.response(404, 'No data found')
    @api.response(500, 'Internal server error')
    def get(self):
        """
        Gets the latest device status.

        Returns:
            :return: Latest device status.
            :rtype: DeviceData
        """

        device_model = DeviceModel()
        latest_status = device_model.fetch_latest_status()

        if latest_status:
            return latest_status, 200
        else:
            return {"error": "No data found"}, 404


@ns_device_status.route('/health')
class DeviceHealth(Resource):

    @api.response(200, 'Device health checked')
    @api.response(404, 'No data found')
    @api.response(500, 'Internal server error')
    def get(self):
        """
        Checks the health status of the device.

        Returns:
            :return: Health status of the device.
            :rtype: str
        """
        device_model = DeviceModel()
        health_status = device_model.check_health()
        return {"health_status": health_status}, 200
