import json
from flask import Response, request
from flask_restx import Resource

from app import api
from models.user import User, ROLES, GENDERS

parser = api.parser()
parser.add_argument('username', type=str, help='Username', location='json', required=True)
parser.add_argument('password', type=str, help='Password', location='json', required=True)
parser.add_argument('email', type=str, help='Email', location='json', required=True)
parser.add_argument('role', type=str, help='Role', location='json', required=True, choices=ROLES)
parser.add_argument('gender', type=str, help='Gender', location='json', required=True, choices=GENDERS)


class SignupEndpoint(Resource):
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
                "email": "foobar@gmail.com",
                "role": "member"
            }
            """
    )
    @api.expect(parser)
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        role = data.get('role')
        gender = data.get('gender')
        
        User.add_user(username, password, email, role, gender)
        
        return Response(
            json.dumps({'message': 'Signup successful'}),
            status=200, mimetype='application/json'
        )
