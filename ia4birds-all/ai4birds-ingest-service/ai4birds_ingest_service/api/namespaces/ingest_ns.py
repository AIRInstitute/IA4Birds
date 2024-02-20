import flask
import requests
from flask import send_file
import json
import os
from flask import jsonify, send_from_directory
from flask_restx import Resource
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service.api.v1 import api 
from ai4birds_ingest_service.utils import handle400error, handle404error, handle500error
from ai4birds_ingest_service.core import cache, limiter
from ai4birds_ingest_service.api.models.ingest_models import windmap_model
from ai4birds_ingest_service.api.parsers.ingest_parsers import location_parser
from ai4birds_ingest_service.model.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.xenocanto_extractor import XenoCanto_Extractor
from ai4birds_ingest_service.model.windmap_extractor import WindMap_Extractor
from ai4birds_ingest_service.model.exclusionmap_extractor import ExclusionMap_extractor
from ai4birds_ingest_service.model.combination_data import combine_data
from ai4birds_ingest_service.model.data_converter import DataConverter

# Endpoints
ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
ns_windmap = api.namespace('windmap', description='Iberian wind map requests')
ns_exclusionmap = api.namespace('exclusionmap', description='Eolic exclusion map for CyL')
ns_sensitivity = api.namespace('sensitivity', description='Sensitivity of birds in the region of Castilla y Leon')
ns_dataBird = api.namespace('dataBird', description='Returns observations and recordings of birds in the region of Castilla y Leon')
ns_spec = api.namespace('api spec', description='Api doc')

@ns_dataBird.route('/')
class DataBird(Resource):
    def get(self):
        """
        Gets data from XencoCanto and eBird API in Castilla y León.

        Returns:
            :return: Combined data from XenoCanto and eBird API.
            :rtype: dict
        """
        ebird_data = EBird_Extractor.ebird_query()
        xenocanto_data = XenoCanto_Extractor().xenocanto_query()
        results = combine_data(data_ebird=ebird_data, data_xenocanto=xenocanto_data)
        return results
    
@ns_xenocanto.route('/')
class XenoCanto(Resource):
    def get(self):
        """
        Gets data from XencoCanto API in Castilla y León.

        Returns:
            :return: Data from XenoCanto API.
            :rtype: dict
        """
        results = XenoCanto_Extractor().xenocanto_query()
        return results

@ns_ebird.route('/')
class EBird(Resource):
    def get(self):
        """
        Gets data from the last 30 days in Castilla y León using eBird API.

        Returns:
            :return: Data from eBird API.
            :rtype: dict
        """
        results = EBird_Extractor().ebird_query()
        return results
    
@ns_windmap.route('/')
class WindMap(Resource):

    @api.expect(windmap_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    #@api.marshal_with(post_windmap_output_model, code=200, description='OK', as_list=False)
    @limiter.limit('1000000/hour') 
    @cache.cached(timeout=1, query_string=True)
    def post(self):
        """
        Obtain wind map data with coordinates.

        Returns:
            :return: Result of the wind map extraction.
            :rtype: dict
        """
        # retrieve arguments
        try:
            obj = flask.request.get_json()
        except:
            return handle400error(ns_windmap, 'Unable to retrieve arguments from request. Please, check the swagger documentation at /v1')

        # check parameters
        try:
            params = location_parser.parse_args()
        except:
            return handle400error(ns_windmap, 'Malformed request. Please, check the request at /v1')
        
        try:
            extractor = WindMap_Extractor()
            result= extractor.windmap_ingest(lat = params['lat'], lon = params['lon'], z = params['z'])
        except:
            return handle500error(ns_windmap)
        return result

@ns_exclusionmap.route('/')
class ExclusionMap(Resource):
    """
    Saves a file *.shp for the eolic exclusion map.

    Returns:
        :return: Message indicating the completion of the download.
        :rtype: str
    """
    def get(self):
        try:
            
            csv_file_path = config.EXCLUSION_EOLICA_CSV_PATH
            if csv_file_path is None:
                logger.error("La ruta del archivo CSV no está definida en las variables de entorno.")
                raise
            else:            
                json_data = DataConverter.csv_to_json(csv_file_path)
                return jsonify({'data': json_data})
        except:
            return handle500error(ns_exclusionmap)
        
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
                json_data = DataConverter.csv_to_json(csv_file_path)
                return jsonify({'data': json_data})
        except:
            return handle500error(ns_exclusionmap)

ns_spec.route('/specz')
class ApiSpec(Resource):
    def get(self):
        try:
            api_spec_path = config.API_SPEC_PATH
            return send_from_directory(directory=api_spec_path, filename='api-spec.yaml')
        except:
            return handle500error(ns_spec)