import flask
import os
from flask import jsonify, request as flask_request, send_file, Response
from flask_restx import Resource

from ai4birds_ingest_service import config, logger
from ai4birds_ingest_service.api.v1 import api
from ai4birds_ingest_service.core import limiter, cache
from ai4birds_ingest_service.utils import handle400error, handle500error

from ai4birds_ingest_service.api.models.ingest_models import (
    windmap_model,
    exclusionmap_model,
    exclusionmap_response_model,
    device_status_model,
    segment_data_output_model,
    heatmap_data_output_model,
    bird_statistics_output_model
)
from ai4birds_ingest_service.api.parsers.ingest_parsers import (
    location_parser,
    exclusionmap_parser,
    exclusionmap_parser_get,
    device_status_parser,
    segment_data_parser,
    heatmap_data_parser,
    bird_statistics_parser,
    bird_statistics_by_camera_parser
)

# Import services
from ai4birds_ingest_service.services.databird_service import DataBirdService
from ai4birds_ingest_service.services.xenocanto_service import XenoCantoService
from ai4birds_ingest_service.services.ebird_service import EBirdService
from ai4birds_ingest_service.services.windmap_service import WindMapService
from ai4birds_ingest_service.services.exclusionmap_service import ExclusionMapService
from ai4birds_ingest_service.services.sensitivity_service import SensitivityService
from ai4birds_ingest_service.services.device_status_service import DeviceStatusService
from ai4birds_ingest_service.services.data_segment_service import DataSegmentService
from ai4birds_ingest_service.services.data_heatmap_service import DataHeatmapService
from ai4birds_ingest_service.services.bird_statistics_service import BirdStatisticsService
from ai4birds_ingest_service.services.heatmap_files_service import HeatmapFilesService
# Define namespaces
ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
ns_windmap = api.namespace('windmap', description='Iberian wind map requests')
ns_exclusionmap = api.namespace('exclusionmap', description='Eolic exclusion map for CyL')
ns_sensitivity = api.namespace('sensitivity', description='Sensitivity of birds in the region of Castilla y Leon')
ns_dataBird = api.namespace('dataBird', description='Returns observations and recordings of birds in the region of Castilla y Leon')
ns_device_status = api.namespace('device-status', description='Device status operations')
ns_segment_data = api.namespace('segment-data', description='Segment data operations')
ns_heatmap_data = api.namespace('heatmap-data', description='Heatmap data operations')
ns_bird_statistics = api.namespace('bird-statistics', description='Bird statistics operations')
ns_heatmap_files = api.namespace('heatmap-files', description='Heatmap files operations')

@ns_dataBird.route('/')
class DataBird(Resource):
    """
    Combines bird observation data from eBird and XenoCanto sources.
    """
    @cache.cached()
    def get(self):
        service = DataBirdService()
        result, status_code = service.get_combined_data()
        return result, status_code


# @ns_xenocanto.route('/')
# class XenoCanto(Resource):
#     """
#     Retrieves bird recordings from XenoCanto and stores them in the database.
#     """
#     @cache.cached()
#     def get(self):
#         service = XenoCantoService()
#         data, status_code = service.get_xenocanto_data()
#         return data, status_code

@ns_xenocanto.route('/')
class XenoCanto(Resource):
    def get(self):
        cache_key = "xenocanto:v1:cnt_spain:castilla_y_leon"

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return cached_data, 200

        service = XenoCantoService()
        data, status_code = service.get_xenocanto_data()

        # Solo cachea si OK
        if status_code == 200:
            #cache.set(cache_key, data, timeout=60 * 60)  # 1 hora
            cache.set(cache_key, data, timeout=15 * 60)   # 15 minutos
        return data, status_code


@ns_ebird.route('/')
class EBird(Resource):
    """
    Retrieves bird sightings from eBird and stores them in the database.
    """
    @cache.cached()
    def get(self):
        service = EBirdService()
        data, status_code = service.get_ebird_data()
        return data, status_code


@ns_windmap.route('/')
class WindMap(Resource):
    """
    Receives coordinates and returns wind map data for the location.
    """
    @api.expect(windmap_model)
    @limiter.limit('1000000/hour')
    def post(self):
        data = flask_request.get_json(force=True)
        if not all(k in data for k in ('lat', 'lon', 'z')):
            return {"message": "Missing 'lat', 'lon', or 'z' in request body"}, 400
            
        service = WindMapService()
        result, status_code = service.get_wind_map_data(data['lat'], data['lon'], data['z'])
        return result, status_code


@ns_exclusionmap.route('/')
class ExclusionMap(Resource):
    """
    Returns exclusion map data in a paginated JSON format.
    """
    @api.expect(exclusionmap_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=exclusionmap_response_model)
    @limiter.limit('1000000/hour')
    def post(self):
        try:
            _ = flask_request.get_json()
            params = exclusionmap_parser.parse_args()
            
            service = ExclusionMapService()
            data, status_code = service.get_paginated_data(params['page'], params['page_size'])
            
            if status_code != 200:
                return jsonify(data), status_code
            return jsonify(data)
        except Exception as e:
            logger.error(f"ExclusionMap Error: {e}")
            return jsonify({'error': str(e)}), 500


@ns_exclusionmap.route('/all')
class ExclusionMapAll(Resource):
    """
    Returns the complete exclusion map dataset as a single JSON response.
    """
    def get(self):
        service = ExclusionMapService()
        data, status_code = service.get_all_data()
        return jsonify(data) if status_code == 200 else (jsonify(data), status_code)


@ns_exclusionmap.route('/zip')
class ExclusionMapZip(Resource):
    """
    Provides a downloadable ZIP file with all exclusion map data.
    """
    def get(self):
        service = ExclusionMapService()
        zip_path, status_code = service.get_zip_data()
        
        if status_code != 200 or zip_path is None:
            return {"message": "Internal error"}, 500
            
        return send_file(zip_path, as_attachment=True, download_name='data.zip', mimetype='application/zip')


@ns_exclusionmap.route('/stream-exclusion-data')
class StreamExclusionData(Resource):
    """
    Streams exclusion map data in batches to a remote backend.
    """
    @limiter.limit('1000000/hour')
    def post(self):
        client_id = flask_request.args.get('id')
        service = ExclusionMapService()
        result, status_code = service.stream_data(client_id)
        return jsonify(result) if status_code == 200 else (jsonify(result), status_code)


@ns_sensitivity.route('/')
class Sensitivity(Resource):
    """
    Retrieves all bird sensitivity data in Castilla y León region.
    """
    def get(self):
        service = SensitivityService()
        data, status_code = service.get_sensitivity_data()
        return jsonify(data) if status_code == 200 else (jsonify(data), status_code)


@ns_device_status.route('/')
class DeviceStatus(Resource):
    """
    Adds a new device status entry to the database.
    """
    @api.expect(device_status_model)
    def post(self):
        try:
            _ = flask_request.get_json(force=True)
            params = device_status_parser.parse_args()
            
            service = DeviceStatusService()
            result, status_code = service.add_status(
                gps_latitude=params['gps_latitude'],
                gps_longitude=params['gps_longitude'],
                status=params['status'],
                storage_status=params['storage_status'],
                last_update=params['last_update']
            )
            
            return result, status_code
        except Exception as e:
            logger.error(f"DeviceStatus Error: {e}")
            return handle500error(ns_device_status)


@ns_device_status.route('/latest')
class LatestDeviceStatus(Resource):
    """
    Retrieves the most recent device status.
    """
    def get(self):
        service = DeviceStatusService()
        data, status_code = service.get_latest_status()
        return data, status_code


@ns_device_status.route('/health')
class DeviceHealth(Resource):
    """
    Checks the current health status of the device system.
    """
    def get(self):
       service = DeviceStatusService()
       status, code = service.check_health()
       return status, code


@ns_segment_data.route('/')
class SegmentData(Resource):
    """
    Retrieves all segment data from the database.

    Returns:
        dict: All segment data.
    """
    @api.expect(segment_data_parser, validate=True)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=segment_data_output_model)
    @limiter.limit('1000000/hour')
    def get(self):
        try:
            params = segment_data_parser.parse_args()

            service = DataSegmentService()
            data, status_code = service.get_data_segment(params['camera_id'])
            return {'segment_data': data}, status_code
        except Exception as e:
            logger.error(f"SegmentData Error: {e}")
            return handle500error(ns_segment_data)

     
@ns_heatmap_data.route('/')
class HeatmapData(Resource):
    """
    Retrieves last heatmap data from the database.

    Returns:
        dict: Last heatmap data.
    """
    @api.expect(heatmap_data_parser, validate=True)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=heatmap_data_output_model)
    @limiter.limit('1000000/hour')
    def get(self):
        try:
            params = heatmap_data_parser.parse_args()

            service = DataHeatmapService()
            data, status_code = service.get_latest_heatmap(params['camera_id'])
            return {'heatmap_data': data}, status_code
        except:
            return handle500error(ns_heatmap_data)


@ns_bird_statistics.route('/')
class BirdStatistics(Resource):
    """
    Retrieves all bird statistics from camera_id and bird_name.

    Returns:
        dict: All bird statistics.
    """
    @api.expect(bird_statistics_parser, validate=True)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=bird_statistics_output_model)
    @limiter.limit('1000000/hour')
    def get(self):
        try:
            params = bird_statistics_parser.parse_args()

            service = BirdStatisticsService()
            data, status_code = service.get_latest_statistics(params['camera_id'], params['bird_name'])
            return {'bird_statistics': data}, status_code
        except:
            return handle500error(ns_bird_statistics)
        
@ns_bird_statistics.route('/by-camera')
class BirdStatisticsByCamera(Resource):
    """
    Retrieves all bird statistics from camera_id.

    Returns:
        dict: All camera statistics.
    """
    @api.expect(bird_statistics_by_camera_parser, validate=True)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.response(200, 'Successful', model=bird_statistics_output_model)
    @limiter.limit('1000000/hour')
    def get(self):
        try:
            params = bird_statistics_by_camera_parser.parse_args()

            service = BirdStatisticsService()
            data, status_code = service.get_latest_statistics_by_camera(params['camera_id'])
            return {'camera_statistics': data}, status_code
        except:
            return handle500error(ns_bird_statistics)
        

@ns_heatmap_files.route('/download/<string:filename>')
class HeatmapFileDownload(Resource):
    """
    Returns heatmap file as direct download/streaming response.
    """
    @limiter.limit('1000000/hour')
    def get(self, filename):
        """
        Download a specific heatmap file directly.
        
        Args:
            filename (str): Name of the heatmap file to download
            
        Returns:
            Flask Response: Direct file response or error
        """
        try:
            service = HeatmapFilesService()
            return service.get_heatmap_file_response(filename)
                
        except Exception as e:
            logger.error(f"HeatmapFileDownload Error: {e}")
            return {'error': str(e)}, 500


@ns_heatmap_files.route('/files')
class HeatmapFilesList(Resource):
    """
    Lists all available heatmap files in the directory.
    """
    @limiter.limit('1000000/hour')
    def get(self):
        """
        Get a list of all available heatmap files.
        
        Returns:
            dict: List of available heatmap files with metadata
        """
        try:
            logger.info("Creating HeatmapFilesService instance in endpoint")
            service = HeatmapFilesService()
            logger.info(f"Service directory: {service.heatmaps_directory}")
            logger.info(f"Directory exists: {os.path.exists(service.heatmaps_directory)}")
            result, status_code = service.list_heatmap_files()
            return result, status_code
            
        except Exception as e:
            logger.error(f"HeatmapFilesList Error: {e}")
            return {'error': str(e)}, 500

