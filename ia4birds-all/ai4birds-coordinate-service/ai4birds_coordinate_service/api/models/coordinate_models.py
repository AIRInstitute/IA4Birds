from flask_restx import fields 

from ai4birds_coordinate_service.api.v1 import api 

nested_model = api.model('Data', {
    'key1': fields.String(description='Data body1', required=True, example='1'),
    'key2': fields.String(description='Data body2', required=True, example='1')
}, description='data model')


get_input_model = api.model('Get input', {
    'id': fields.Integer(decription='Data id', required=True, example=1)
})

post_input_model = api.model('Post Input', {
    'param1': fields.String(description='Param 1', required=True, example='param1'),
    'param2': fields.String(description='Param 2', required=True, example='param2')
})


put_input_model = api.model('Put Input', {
    'id': fields.Integer(description='Data Id', required=True, example=1),
    'param1': fields.String(description='Param 1', required=True, example='param1'),
    'param2': fields.String(description='Param 2', required=True, example='param2')
})

delete_input_model = api.model('Delete Input', {
    'id': fields.Integer(description='Data Id', required=True, example=1)
})

output_model = api.model('Output', {
    'id': fields.Integer(description='Data id', required=True),
    'data': fields.Nested(nested_model, description='Data', skip_none=True, allow_null=False),
    'created_at': fields.DateTime(description='Created data at', required=True)
})