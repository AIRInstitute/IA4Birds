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
