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


# Modelo para las coordenadas (array de arrays)
coordenadas_model = api.model('Coordenadas', {
    'coordenadas': fields.List(fields.List(fields.Float, required=True), required=True,
                               description='Lista de coordenadas de la ZEPA')
})

# Modelo para cada elemento en "data"
data_item_model = api.model('DataItem', {
    'ambito': fields.String(required=True, description='Ámbito de protección', example='RANP - Red Natura 2000'),
    'area_excl': fields.String(required=True, description='Área de exclusión', example='ZEPA'),
    'coordenadas': fields.Nested(coordenadas_model, description='Coordenadas de la ZEPA'),
    'criterio': fields.String(required=True, description='Criterio de protección', example='Red de Áreas Naturales Protegidas'),
    'espacio': fields.String(required=True, description='Espacio protegido', example='Sierra de la Cabrera - ZEPA'),
    'fid': fields.Integer(required=True, description='Identificador FID', example=34745),
    'identific': fields.String(required=True, description='Identificación del espacio', example='Sierra de la Cabrera - ZEPA'),
    't_instalac': fields.String(required=True, description='Tipo de instalación', example='Parques eólicos')
})

# Modelo para "metadata"
metadata_model = api.model('Metadata', {
    'current_page': fields.Integer(required=True, description='Número de página actual', example=1),
    'page_size': fields.Integer(required=True, description='Cantidad de elementos por página', example=20),
    'total_data': fields.Integer(required=True, description='Total de elementos', example=10000),
    'total_pages': fields.Integer(required=True, description='Total de páginas', example=500)
})

# Modelo para la respuesta general que incluye "data" y "metadata"
exclusionmap_response_model = api.model('ExclusionMapResponse', {
    'data': fields.List(fields.Nested(data_item_model), required=True, description='Lista de datos de áreas protegidas'),
    'metadata': fields.Nested(metadata_model, required=True, description='Metadatos sobre la paginación de la respuesta')
})