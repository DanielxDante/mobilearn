import json
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt_identity,
    get_jwt
)
from sqlalchemy import func

from app import api, jwt
from database import session_scope, create_session
from models.token import TokenBlocklist

class RefreshTokenEndpoint(Resource): # runs before token expires
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
        """ Refreshes a user's token """
        try:
            identity = get_jwt_identity()
            access_token = create_access_token(identity=identity)
            return Response(
                json.dumps({'access_token': access_token}),
                status=200, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({'message': "Could not refresh token"}),
                status=400, mimetype='application/json'
            )

# @jwt.token_in_blocklist_loader
# def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
#     jti = jwt_payload["jti"]
#     token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

#     return token is not None

class LogoutEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
    )
    @jwt_required()
    def post(self):
        """ Logs out a user """

        return Response(
            json.dumps({'message': 'Logged out'}),
            status=200, mimetype='application/json'
        )