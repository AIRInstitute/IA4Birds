from flask_restx import fields 
from ai4birds_ingest_service.api.v1 import api 


windmap_model = api.model('WindMapModel', {
    'lat': fields.Float(description='Latitude', required=True, example=41.85563222906876),
    'lon': fields.Float(description='Longitude', required=True, example=-5.5495918821608665),
    'z': fields.Integer(description='Altitude', required=True, example=50)
}, description='Model for obtaining location data based on latitude and longitude')

exclusionmap_model = api.model('ExclusionMapModel',{
   'page': fields.Integer(description= 'Number of page', required= True, example=1),
   'page_size': fields.Integer(description='Size of page', required=True, example=20)                          
},description='Model for exclusion map ')