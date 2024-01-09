from flask_restx import Resource
import requests
import json

from ai4birds_ingest_service.api.v1 import api 
from ai4birds_ingest_service.utils import handle400error, handle404error, handle500error
from ai4birds_ingest_service.core import cache, limiter
from ai4birds_ingest_service.api.models.ingest_models import post_input_model, put_input_model, output_model
from ai4birds_ingest_service.api.parsers.ingest_parsers import post_parser, get_parser, put_parser, delete_parser
from ai4birds_ingest_service.model.ingest_model import Model, EBird_Model, XenoCanto_Model

ns_db = api.namespace('crud', description='Manage CRUD endpoint')
ns_xenocanto = api.namespace('xenocanto', description='Xenocanto requests')
ns_ebird = api.namespace('ebird', description='eBird requests')
@ns_db.route('/')
class nsCRUD(Resource):

    @api.expect(get_parser)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.marshal_with(output_model, code=200, description='OK', as_list=False)
    @limiter.limit('10000/hour') 
    @cache.cached(timeout=1, query_string=True)
    def get(self):
        try:
            args = get_parser.parse_args()
            data_id = args['id']
        except:
            return handle400error(ns, 'Malformed request. Please, check the request')
        try:
            model = Model()
            obj = model.get(data_id)
            
            if obj is not None:
                return obj.to_json()
        
            else:
                return handle404error(ns, "Not found")

        except Exception as e:
            return handle500error(ns, f"An error occurred: {str(e)}")

    @api.expect(post_input_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.marshal_with(output_model, code=200, description='OK', as_list=False)
    @limiter.limit('10000/hour') 
    @cache.cached(timeout=1, query_string=True)
    def post(self):
        try:
            args = post_parser.parse_args(strict=True)
            data_dict = args['data']

            if not data_dict:
                return handle400error(ns, 'Field "data" is required and cannot be empty')
        
        except:
            return handle400error(ns, 'Malformed request. Please, check the request')
        
        try:
            model = Model()
            obj = model.post(data_dict)
            
            if obj is not None:
                return obj.to_json()
        
            else:
                return handle404error(ns, "Not found")

        except Exception as e:
            return handle500error(ns, f"An error occurred: {str(e)}")

    @api.expect(put_input_model)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.marshal_with(output_model, code=200, description='OK', as_list=False)
    @limiter.limit('10000/hour') 
    @cache.cached(timeout=1, query_string=True)
    def put(self):
        try:
            args = put_parser.parse_args(strict=True)
            data_id = args['id']
            data_dict = args['data']
        except:
            return handle400error(ns, 'Malformed request. Please, check the request')
        
        try:
            model = Model()
            obj = model.put(data_id, data_dict)
            
            if obj is not None:
                return obj.to_json()
        
            else:
                return handle404error(ns, "Not found")

        except:
            return handle500error(ns, f"An error occurred: {str(e)}")

    @api.expect(delete_parser)
    @api.response(404, 'Data not found')
    @api.response(500, 'Unhandled errors')
    @api.response(400, 'Invalid parameters')
    @api.marshal_with(output_model, code=200, description='OK', as_list=False)
    @limiter.limit('10000/hour') 
    @cache.cached(timeout=1, query_string=True)
    def delete(self):
        try:
            args = delete_parser.parse_args()
            data_id = args['id']
        except:
            return handle400error(ns, 'Malformed request. Please, check the request')
        
        try:
            model = Model()
            obj = model.delete(data_id)
            
            if obj is not None:
                return obj.to_json()
        
            else:
                return handle404error(ns, "Not found")

        except:
            return handle500error(ns, f"An error occurred: {str(e)}")

@ns_xenocanto.route('/')
class XenoCanto(Resource):
    def get(self):
        model = XenoCanto_Model()
        results = model.xenocanto_query()
        return results

@ns_ebird.route('/')
class EBird(Resource):
    def get(self):
        # Gets data from the last 30 days in Castilla y León
        model = EBird_Model()
        results = model.ebird_query()
        return results