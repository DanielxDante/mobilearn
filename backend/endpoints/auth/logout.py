import json
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt_identity,
    get_jwt,
    decode_token
)

from app import api
from database import session_scope, create_session
from models.token import TokenBlocklist

class RefreshTokenEndpoint(Resource): # runs before token expires
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          }
        },
    )
    @jwt_required(refresh=True)
    def post(self):
        """ Refreshes a user's access token using refresh token """
        try:
            identity = get_jwt_identity()
            access_token = create_access_token(identity=identity)
            return Response(
                json.dumps({'access_token': f"Bearer {access_token}"}),
                status=200, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({'message': "Could not refresh token"}),
                status=400, mimetype='application/json'
            )

logoutParser = api.parser()
logoutParser.add_argument('refresh_token', type=str, help='Refresh Token', location='json', required=True)

class LogoutEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          }
        },
        description="""
        Access token in Header, Refresh token in JSON body
        Example request JSON:

            {
                "refresh_token": "Bearer ..."
            }
        """
    )
    @api.expect(logoutParser)
    @jwt_required()
    def delete(self):
        """ Logs out a user """
        data = request.get_json()
        refresh_token = data.get('refresh_token').replace("Bearer ", "").strip()
        
        try:
            access_jti = get_jwt()['jti']
            refresh_jti = decode_token(refresh_token)["jti"]

            with session_scope() as session:
                TokenBlocklist.add_token(session, access_jti, "access")
                TokenBlocklist.add_token(session, refresh_jti, "refresh")
            return Response(
                json.dumps({'message': 'Logged out'}),
                status=200, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({'message': str(e)}),
                status=400, mimetype='application/json'
            )