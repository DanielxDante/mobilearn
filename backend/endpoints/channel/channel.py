import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from services.user_services import UserService
from services.channel_services import ChannelService

class GetUserChannelsEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
    )
    @jwt_required()
    def get(self):
        """ Get channels the user is in """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            channels = UserService.get_user_channels(session, current_email)
            channels_info = [{
                'id': channel.id,
                'name': channel.name,
                'description': channel.description,
                'channel_picture_url': channel.channel_picture_url
            } for channel in channels]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'channels': channels_info}),
            status=200, mimetype='application/json'
        )


invite_user_channel_parser = api.parser()
invite_user_channel_parser.add_argument('invite_code', type=str, help='Channel Invite Code', location='json', required=True)

class InviteUserToChannelEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "invite_code": "a1b2c3"
            }
            """
    )
    @api.expect(invite_user_channel_parser)
    @jwt_required()
    def post(self):
        """ Invite user to channel """
        data = request.get_json()
        invite_code = data.get('invite_code')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                channel_id = ChannelService.invite_user(session, invite_code, current_email)
            except ValueError as ee:
                if str(ee) == "Channel not found":
                    return Response(
                        json.dumps({'message': "Invite code is invalid"}),
                        status=201, mimetype='application/json'
                    )
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'channel_id': channel_id}),
            status=200, mimetype='application/json'
        )