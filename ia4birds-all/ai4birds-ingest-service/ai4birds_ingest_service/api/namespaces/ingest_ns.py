# import ai4birds_ai_service.api

import flask
import requests
import json
from flask_restx import Resource
from ai4birds_ingest_service.api.v1 import api 
from ai4birds_ingest_service.utils import handle400error, handle404error, handle500error
from ai4birds_ingest_service.core import cache, limiter
from ai4birds_ingest_service.api.models.ingest_models import windmap_model
from ai4birds_ingest_service.api.parsers.ingest_parsers import location_parser
from ai4birds_ingest_service.model.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.xenocanto_extractor import XenoCanto_Extractor
from ai4birds_ingest_service.model.windmap_extractor import WindMap_Extractor
from ai4birds_ingest_service.model.exclusionmap_extractor import ExclusionMap_extractor
from ai4birds_ingest_service.model.combination_data import CombinerDataBird

windmap = WindMap_Extractor()
exclusionmap = ExclusionMap_extractor()

ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
ns_windmap = api.namespace('windmap', description='Iberian wind map requests')
ns_exclusionmap = api.namespace('exclusionmap', description='Eolic exclusion map for CyL')
ns_dataBird = api.namespace('dataBird', description='Returns observations and recordings of birds in the region of Castilla y Leon')

@ns_dataBird.route('/')
class DataBird(Resource):
    def get(self):
        """
        Gets data from XencoCanto and Ebird API in Castilla y León
        """
        ebird_extractor = EBird_Extractor()
        xeno_canto_extractor = XenoCanto_Extractor()

        combination = CombinerDataBird()
        data_ebird = ebird_extractor.ebird_query()
        data_xenocanto = xeno_canto_extractor.xenocanto_query()

        results = combination.combine_data(data_ebird=data_ebird, data_xenocanto= data_xenocanto)

        return results
@ns_xenocanto.route('/')
class XenoCanto(Resource):
    def get(self):
        """
        Gets data from XencoCanto in Castilla y León
        """
        
        model = XenoCanto_Extractor()
        results = model.xenocanto_query()
        return results

@ns_ebird.route('/')
class EBird(Resource):
    def get(self):
        """
        Gets data from the last 30 days in Castilla y León
        """

        model = EBird_Extractor()
        results = model.ebird_query()
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
        Obtain data with coordinates
        """
        global windmap

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
            result= windmap.windmap_ingest(lat = params['lat'], lon = params['lon'], z = params['z'])
        except:
            return handle500error(ns_windmap)
        
        return result

@ns_exclusionmap.route('/')
class ExclusionMap(Resource):
    """
    Saves file *.shp 
    """
    def get(self):
        global exclusionmap 

        try:
            exclusionmap.exclusionMap_ingest()
        except:
            return handle500error(ns_exclusionmap)
        
        return 'Download completed'