import flask
import requests
import time
from flask import jsonify, request as flask_request, send_file, Response
from flask_restx import Resource

from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service.api.v1 import api
from ai4birds_ingest_service.core import limiter
from ai4birds_ingest_service.utils import handle400error, handle500error

from ai4birds_ingest_service.api.models.ingest_models import (
    windmap_model,
    exclusionmap_model,
    exclusionmap_response_model,
    device_status_model
)
from ai4birds_ingest_service.api.parsers.ingest_parsers import (
    location_parser,
    exclusionmap_parser,
    device_status_parser
)

from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor
from ai4birds_ingest_service.model.extractor.windmap_extractor import WindMap_Extractor
from ai4birds_ingest_service.model.device_status.device_model import DeviceModel, DeviceData
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel, EBirdData
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel, XenoCantoData
from ai4birds_ingest_service.model.combination_data import combine_data

from ai4birds_ingest_service.model.data_services.csv_to_json_service import CSVToJsonService
from ai4birds_ingest_service.model.data_services.csv_streamer import CSVStreamer
from ai4birds_ingest_service.model.data_services.zip_generator import ZipGenerator



ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
ns_windmap = api.namespace('windmap', description='Iberian wind map requests')
ns_exclusionmap = api.namespace('exclusionmap', description='Eolic exclusion map for CyL')
ns_sensitivity = api.namespace('sensitivity', description='Sensitivity of birds in the region of Castilla y Leon')
ns_dataBird = api.namespace('dataBird', description='Returns observations and recordings of birds in the region of Castilla y Leon')
ns_device_status = api.namespace('device-status', description='Device status operations')


@ns_dataBird.route('/')
class DataBird(Resource):
    """
    Combines bird observation data from eBird and XenoCanto sources.

    Returns:
        dict: Combined results from both sources.
    """
    def get(self):

        ebird_data_raw = EBird_Extractor().ebird_query()
        xenocanto_data = XenoCanto_Extractor().xenocanto_query()

        results = combine_data(data_ebird=ebird_data_raw, data_xenocanto=xenocanto_data) if (ebird_data_raw and xenocanto_data) else {"error": "Failed to retrieve data from one or both sources."}
        return results


@ns_xenocanto.route('/')
class XenoCanto(Resource):
    """
    Retrieves bird recordings from XenoCanto and optionally stores them in the database.

    Returns:
        list: Raw data from XenoCanto.
    """
    def get(self):
        data = XenoCanto_Extractor().xenocanto_query()
        if data:
            model = XenoCantoModel()
            objects = [XenoCantoData.from_dict(item) for item in data]
            model.add_batch(objects)
        return data


@ns_ebird.route('/')
class EBird(Resource):
    """
    Retrieves bird sightings from eBird and optionally stores them in the database.

    Returns:
        list or dict: Raw data from eBird or error message.
    """
    def get(self):
        data = EBird_Extractor().ebird_query()
        if data:
            model = EBirdModel()
            objects = [EBirdData.from_dict(item) for item in data]
            model.add_batch(objects)
        return data or {"error": "No data retrieved from eBird API"}, 200 if data else 404


@ns_windmap.route('/')
class WindMap(Resource):
    """
    Receives coordinates and returns wind map data for the location.

    Returns:
        dict: Wind map data for the given coordinates.
    """
    @api.expect(windmap_model)
    @limiter.limit('1000000/hour')
    def post(self):
        data = flask_request.get_json(force=True)
        if not all(k in data for k in ('lat', 'lon', 'z')):
            return {"message": "Missing 'lat', 'lon', or 'z' in request body"}, 400
        try:
            result = WindMap_Extractor().windmap_ingest(lat=data['lat'], lon=data['lon'], z=data['z'])
            return result
        except:
            return handle500error(ns_windmap)


@ns_exclusionmap.route('/')
class ExclusionMap(Resource):
    """
    Returns exclusion map data in a paginated JSON format.

    Returns:
        dict: Paginated exclusion zone data.
    """
    @api.expect(exclusionmap_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=exclusionmap_response_model)
    @limiter.limit('1000000/hour')
    def post(self):
        try:
            # _ -> variable ignorada, solo quieres ejecutar una función por sus efectos secundarios
            # Pero no necesitas el valor devuelto.
            _ = flask_request.get_json()
            params = exclusionmap_parser.parse_args()
            service = CSVToJsonService()
            data = service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=params['page'], page_size=params['page_size'])
            if not data['data']:
                return jsonify({"message": "Data not found for the specified page parameters"}), 404
            return jsonify(data)
        except Exception as e:
            logger.error(f"ExclusionMap Error: {e}")
            return jsonify({'error': str(e)}), 500

@ns_exclusionmap.route('/all')
class ExclusionMapAll(Resource):
    """
    Returns the complete exclusion map dataset as a single JSON response.

    Returns:
        dict: All exclusion zone data.
    """
    def get(self):
        try:
            service = CSVToJsonService()
            data = service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=1, page_size=10**6)
            return jsonify({'data': data['data']})
        except Exception as e:
            logger.error(f"ExclusionMapAll Error: {e}")
            return jsonify({'error': str(e)}), 500

@ns_exclusionmap.route('/zip')
class ExclusionMapZip(Resource):
    """
    Provides a downloadable ZIP file with all exclusion map data.

    Returns:
        Response: ZIP file containing exclusion data.
    """
    def get(self):
        try:
            service = CSVToJsonService()
            data = service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=1, page_size=10**6)
            zip_path = ZipGenerator.json_to_zip(data)
            return send_file(zip_path, as_attachment=True, download_name='data.zip', mimetype='application/zip')
        except Exception as e:
            logger.error(f"Zip Generation Error: {e}")
            return {"message": "Internal error"}, 500


@ns_exclusionmap.route('/stream-exclusion-data')
class StreamExclusionData(Resource):
    """
    Streams exclusion map data in batches to a remote backend.

    Returns:
        dict: Confirmation of data streaming completion.
    """
    @limiter.limit('1000000/hour')
    def post(self):
        try:
            URL = f'http://{config.BACKEND_URL}/api/data/exclusionmap/stream-exclusion-data?client_id={client_id}'
            streamer = CSVStreamer()
            client_id = flask_request.args.get('id')
            for batch in streamer.stream(config.EXCLUSION_EOLICA_CSV_PATH):
                
                response = requests.post(URL, json=batch)
                if response.status_code != 200:
                    logger.warning(f"Failed to send batch: {response.status_code}")
                time.sleep(1)
            return jsonify({"message": "Data streaming completed."})
        except Exception as e:
            logger.error(f"Streaming Error: {e}")
            return jsonify({'error': str(e)}), 500


@ns_sensitivity.route('/')
class Sensitivity(Resource):
    """
    Retrieves all bird sensitivity data in Castilla y León region.

    Returns:
        dict: Full dataset from sensitivity CSV.
    """
    def get(self):
        try:
            data = CSVToJsonService().convert(config.CORRDENADAS_CSV_PATH, page=1, page_size=10**6)
            return jsonify({'data': data['data']})
        except:
            return handle500error(ns_sensitivity)


@ns_device_status.route('/')
class DeviceStatus(Resource):
    """
    Adds a new device status entry to the database.

    Returns:
        dict: Success or error message.
    """
    @api.expect(device_status_model)
    def post(self):
        try:
            _ = flask_request.get_json(force=True)
            params = device_status_parser.parse_args()
            data = DeviceData(
                gps_latitude=params['gps_latitude'],
                gps_longitude=params['gps_longitude'],
                status=params['status'],
                storage_status=params['storage_status'],
                last_update=params['last_update']
            )
            result = DeviceModel().add(data)
            return {"message": "Device status added successfully"} if result else {"error": "Failed to add device status"}, 200 if result else 500
        except:
            return handle500error(ns_device_status)


@ns_device_status.route('/latest')
class LatestDeviceStatus(Resource):
    """
    Retrieves the most recent device status.

    Returns:
        dict: Last known status or error message.
    """
    def get(self):
        data = DeviceModel().fetch_latest_status()
        return (data, 200) if data else ({"error": "No data found"}, 404)


@ns_device_status.route('/health')
class DeviceHealth(Resource):
    """
    Checks the current health status of the device system.

    Returns:
        dict: Health status.
    """
    def get(self):
        return {"health_status": DeviceModel().check_health()}, 200
