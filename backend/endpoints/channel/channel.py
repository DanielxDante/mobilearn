import json
from flask_restx import Resource, Namespace
from flask import Response, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


from app import api
from models.channel import Channel

parser = api.parser()
parser.add_argument('name', type=str, help='Name', location='json', required=True)

class ChannelEndpoint(Resource):
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
                'name': channel.name,
            }
            """
    )

    @api.expect(parser)
    def post(self):
        data = request.get_json()
        name = data.get('name')
        Channel.add_channel(name)

        return Response(
            json.dumps({'message': f'Channel ({name}) created'}),
            status=200, mimetype="application/json"
        )

    def get_channels(self):
        channels = Channel.get_channels()
        response_data = [{
            'id': channel.id,
            'name': channel.name, 
            'invite_code': channel.invite_code,
            'created_on': channel.created_on,
            'num_user': channel.num_user
        } for channel in channels]

        return Response(
            response = jsonify(response_data),
            status = 200,
            mimetype='application/json'
        )
    
class GetAllChannelEndpoint(Resource):
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
        description=""
    )
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        return Response(
            json.dumps({"lmao": identity}),
            status=200, mimetype='application/json'
        )