import json
from flask_restx import Resource, Namespace
from flask import Response, request, jsonify

from app import api
from models.channel import Channel

parser = api.parser()
parser.add_argument('title', type=str, help='Title', location='json', required=True)

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
                'title': channel.title,
            }
            """
    )

    @api.expect(parser)
    def post(self):
        data = request.get_json()
        title = data.get('title')
        Channel.add_channel(title)

        return Response(
            json.dumps({'message': f'Channel ({title}) created'}),
            status=200, mimetype="application/json"
        )

    def get_channels(self):
        channels = Channel.get_channels()
        response_data = [{
            'id': channel.id,
            'title': channel.title, 
            'invite_code': channel.invite_code,
            'created_at': channel.created_at,
            'num_user': channel.num_user
        } for channel in channels]

        return Response(
            response = jsonify(response_data),
            status = 200,
            mimetype='application/json'
        )