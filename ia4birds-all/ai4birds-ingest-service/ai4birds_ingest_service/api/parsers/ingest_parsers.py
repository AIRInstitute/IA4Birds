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

exclusionmap_parser_get = reqparse.RequestParser()
exclusionmap_parser_get.add_argument('page', type=int, required=True, help='Page is required', location='args')
exclusionmap_parser_get.add_argument('page_size', type=int, required=True, help='Page size is required', location='args')

# Add arguments to the device status parser
device_status_parser = reqparse.RequestParser()
device_status_parser.add_argument('gps_latitude', type=float, required=True, help='Latitude of the device GPS')
device_status_parser.add_argument('gps_longitude', type=float, required=True, help='Longitude of the device GPS')
device_status_parser.add_argument('status', type=str, required=True, help='Current status of the device')
device_status_parser.add_argument('storage_status', type=float, required=True, help='Available storage in GB')
device_status_parser.add_argument('last_update', type=str, required=True, help='Last update timestamp')

# Add arguments to the segment data parser
segment_data_parser = reqparse.RequestParser()
segment_data_parser.add_argument('camera_id', type=str, required=True, help='ID of the camera')

# Add arguments to the heatmap data parser
heatmap_data_parser = reqparse.RequestParser()
heatmap_data_parser.add_argument('camera_id', type=str, required=True, help='ID of the camera')

#Add arguments to the bird statistics parser
bird_statistics_parser = reqparse.RequestParser()
bird_statistics_parser.add_argument('camera_id', type=str, required=True, help='ID of the camera')
bird_statistics_parser.add_argument('bird_name', type=str, required=True, help='Name of the bird')

bird_statistics_by_camera_parser = reqparse.RequestParser()
bird_statistics_by_camera_parser.add_argument('camera_id', type=str, required=True, help='ID of the camera')