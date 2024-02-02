#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
import requests
from flask import json
from flask_restx import Resource
from ai4birds_coordinate_service.api.v1 import api 
from ai4birds_coordinate_service.api.models.coordinate_models import get_input_model, post_input_model, put_input_model, delete_input_model, output_model
from ai4birds_coordinate_service.api.parsers.coordinate_parsers import get_parser, post_parser, put_parser, delete_parser 
from ai4birds_coordinate_service.utils import handle400error, handle404error, handle500error
from ai4birds_coordinate_service.model.coordinate_model import CheckModel, XenoCanto, EBird, WindMap, ExclusionMap

ns = api.namespace('IngestApi', description='Coordinate endpoints')
ebird_ns = api.namespace('EBird', description='EBird requests')
xenocanto_ns = api.namespace('XenoCanto', description='XenoCanto requests') 
windmap_ns = api.namespace('WindMap', description='Windmap requests')
exclusionmap_ns = api.namespace('ExclusionMap', description='ExclusionMap requests')

@ns.route('/')
class Coordinate(Resource):
    @ns.expect(get_parser)
    def get(self):
        try :
            args = get_parser.parse_args()
            id = args['id']
        except Exception as e:
            return handle400error(ns, e)
        
        model = CheckModel()
        return model.get(id) 
    
    @ns.expect(post_input_model)
    def post(self):
        try:
            args = post_parser.parse_args()
            data = {
                "data": {
                    "key1": args['param1'],
                    "key2": args['param2']
                }
            }
        except Exception as e:
            return handle400error(ns, e)
        
        model = CheckModel()
        return model.post(data)
        

    @ns.expect(put_input_model)
    def put(self):
        try:
            args = put_parser.parse_args()
            id = args['id']
            data = {
                "data": {
                    "key1": args['param1'],
                    "key2": args['param2']
                }
            }
        except Exception as e:
            return handle400error(ns, e)
        
        model = CheckModel()
        return model.put(id, data)
        

    @ns.expect(delete_parser)
    def delete(self):
        try:
            args = delete_parser.parse_args()
            id = args['id']
        
        except Exception as e:
            return handle400error(ns, e)
        
        model = CheckModel()
        return model.delete(id)

@ebird_ns.route('/')
class EBirdCoordinate(Resource):
    """
    Gets data from the last 30 days in Castilla y León using eBird API.

    Returns:
        :return: Data from eBird API.
        :rtype: dict
    """
    def get(self):
        return EBird.get()

@xenocanto_ns.route('/')
class XenoCantoCoordinate(Resource):
    """
    Gets data from XencoCanto API in Castilla y León.

    Returns:
        :return: Data from XenoCanto API.
        :rtype: dict
    """
    def get(self):
        return XenoCanto.get()

@windmap_ns.route('/')
class WindMapCoordinate(Resource):
    """
    Obtain wind map data with coordinates.

    Returns:
        :return: Result of the wind map extraction.
        :rtype: dict
    """
    def get(self, lat: float, lon: float, z: int):
        return WindMap.get(lat, lon, z)

@exclusionmap_ns.route('/')
class ExclusionMap(Resource):
    """
    Saves a file *.shp for the eolic exclusion map.

    Returns:
        :return: Message indicating the completion of the download.
        :rtype: str
    """
    def get(self):
        return ExclusionMap.get()