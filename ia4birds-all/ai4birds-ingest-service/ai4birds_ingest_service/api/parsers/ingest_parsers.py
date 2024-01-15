from flask_restx import reqparse

# post_parser = reqparse.RequestParser()
# post_parser.add_argument('data', location='json', type=dict, required=True, help='missing data')

# put_parser = reqparse.RequestParser()
# put_parser.add_argument('id', type=int, required=True, help='missing id')
# put_parser.add_argument('data', location='json', type=dict, required=True, help='missing data')

# get_parser = reqparse.RequestParser()
# get_parser.add_argument('id', type=int, required=True, help='missing id')

# delete_parser = reqparse.RequestParser()
# delete_parser.add_argument('id', type=int, required=True, help='missing id')

# Crear el parser
location_parser = reqparse.RequestParser()

# Agregar argumentos para latitud y longitud
location_parser.add_argument('lat', location='json', type=float, required=True, help='Latitud es requerida.')
location_parser.add_argument('lon', location='json', type=float, required=True, help='Longitud es requerida.')
location_parser.add_argument('z', location='json', type=int, required=True, help='Altitud es requerida.')