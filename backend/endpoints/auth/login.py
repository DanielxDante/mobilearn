import json
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

from app import api
from models.user import User

parser = api.parser()
parser.add_argument('username', type=str, help='Username', location='json', required=True)
parser.add_argument('password', type=str, help='Password', location='json', required=True)

class LoginEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        description="""
            Example request JSON:

            {
                "username": "foo",
                "password": "bar",
            }
            """
    )
    @api.expect(parser)
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and Bcrypt().check_password_hash(user.password_hash, password):
            token = create_access_token(identity=username)
            return Response(
                json.dumps({'message': 'Login successful', 'token': f"Bearer {token}"}),
                status=200, mimetype='application/json'
            )
        else:
            return Response(
                json.dumps({'message': 'Invalid username or password'}),
                status=401, mimetype='application/json'
            )