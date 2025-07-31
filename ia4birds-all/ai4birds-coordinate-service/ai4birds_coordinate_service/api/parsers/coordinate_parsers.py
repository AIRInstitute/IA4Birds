from flask_restx import reqparse


get_parser = reqparse.RequestParser()
get_parser.add_argument('id', type=int, required=True, help='missing id')

post_parser = reqparse.RequestParser()
post_parser.add_argument('param1', location='json', type=str, required=True, help='missing param1')
post_parser.add_argument('param2', location='json', type=str, required=True, help='missing param2')

put_parser = reqparse.RequestParser()
put_parser.add_argument('id', location='json', type=int, required=True, help='missing id')
put_parser.add_argument('param1', location='json', type=str, required=True, help='missing param1')
put_parser.add_argument('param2', location='json', type=str, required=True, help='missing param2')

delete_parser = reqparse.RequestParser()
delete_parser.add_argument('id', type=int, required=True, help='missing id')

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
