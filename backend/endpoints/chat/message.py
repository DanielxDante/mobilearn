import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from models.user import User
from models.chat import Chat

class GetChatMessagesEndpoint(Resource):
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
        }
    )
    @jwt_required()
    def get(self):
        """ Get paginated chat messages """
        data = request.get_json()
        user_email = data.get('user_email')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                new_chat_id = Chat.create_private_chat(session, current_email, user_email)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'chat_id': new_chat_id}),
            status=200, mimetype='application/json'
        )

# class SendChatMessageEndpoint(Resource):
#     @api.doc(
#         responses={
#             200: 'Ok',
#             400: 'Bad request',
#             401: 'Unauthorized',
#             404: 'Resource not found',
#             500: 'Internal Server Error'
#         },
#         params={
#             'Authorization': {
#                 'in': 'header',
#                 'description': 'Bearer token',
#                 'required': True
#             }
#         },
#         description="""
#             Example request JSON:

#             {
#                 "user_email": "