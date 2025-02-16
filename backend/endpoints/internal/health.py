import json
from flask import Response, request
from flask_restx import Resource

from app import api

class CheckBasicHealthEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            500: 'Internal Server Error'
        }
    )
    def get(self):
        """ Check basic health of the service """
        return Response(
            json.dumps({'message': 'I am okay. I am fine.'}),
            status=200, mimetype='application/json'
        )