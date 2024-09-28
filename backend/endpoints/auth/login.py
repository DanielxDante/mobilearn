import json
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

from app import api
from models.user import User, ROLES

parser = api.parser()
parser.add_argument('email', type=str, help='Email', location='json', required=True)
parser.add_argument('password', type=str, help='Password', location='json', required=True)
parser.add_argument('role', type=str, help='Role', location='json', required=True, choices=ROLES)

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
                "email": "foobar@gmail.com",
                "password": "bar",
                "role": "member"
            }
            """
    )
    @api.expect(parser)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        # TODO: simple backdoor for admin for now, to be further secured later on
        if (email == "admin" and password == "admin"):
            token = create_access_token(identity=email)
            return Response(
                json.dumps({'message': 'Login successful', 'username': 'admin', 'role': 'admin', 'token': f"Bearer {token}"}),
                status=200, mimetype='application/json'
            )
        
        user = User.query.filter_by(email=email, role=role).first()
        
        if user and Bcrypt().check_password_hash(user.password_hash, password):
            token = create_access_token(identity=email)
            username = user.username
            return Response(
                json.dumps({'message': 'Login successful', 'username': username, 'role': role, 'token': f"Bearer {token}"}),
                status=200, mimetype='application/json'
            )
        else:
            return Response(
                json.dumps({'message': 'Invalid username or password'}),
                status=401, mimetype='application/json'
            )