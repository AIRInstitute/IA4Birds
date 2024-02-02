from flask_restx import reqparse

# Create a parser for location data
location_parser = reqparse.RequestParser()

# Add arguments to the location parser for latitude, longitude, and altitude
location_parser.add_argument('lat', location='json', type=float, required=True, help='latitude is required')
location_parser.add_argument('lon', location='json', type=float, required=True, help='longitude is required')
location_parser.add_argument('z', location='json', type=int, required=True, help='altitude is required')