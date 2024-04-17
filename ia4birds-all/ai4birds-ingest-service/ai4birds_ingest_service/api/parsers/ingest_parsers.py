from flask_restx import reqparse

# Create a parser for location data
location_parser = reqparse.RequestParser()

# Add arguments to the location parser for latitude, longitude, and altitude
location_parser.add_argument('lat', location='json', type=float, required=True, help='latitude is required')
location_parser.add_argument('lon', location='json', type=float, required=True, help='longitude is required')
location_parser.add_argument('z', location='json', type=int, required=True, help='altitude is required')# Create a parser for location data

exclusionmap_parser = reqparse.RequestParser()

# Add arguments to the location parser for latitude, longitude, and altitude
exclusionmap_parser.add_argument('page', location='json', type=int, required=True, help='page is required')
exclusionmap_parser.add_argument('page_size', location='json', type=int, required=True, help='page_size is required')
