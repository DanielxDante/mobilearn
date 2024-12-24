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

# class GetAllUsersEndpoint(Resource): # check for user status
#     @api.doc(
#         responses={
#             200: 'Ok',
#             401: 'Unauthorized',
#             500: 'Internal Server Error'
#         },
#         description="""
#             Get all users
#             """
#     )
#     @jwt_required()
#     def get(self):
#         """ Get all users """
#         with session_scope() as session:
#             users = User.get_users(session)
#             users = [user.to_dict() for user in users]
#         return Response(
#             json.dumps(users),
#             status=200, mimetype='application/json'
#         )
    
# class GetUserChatsEndpoint(Resource):
#     @api.doc(
#         responses={
#             200: 'Ok',
#             401: 'Unauthorized',
#             500: 'Internal Server Error'
#         },
#         description="""
#             Get all chats for user
#             """
#     )
#     @jwt_required()
#     def get(self):
#         """ Get all chats for user """
#         current_email = get_jwt_identity()
#         with session_scope() as session:
#             user = User.get_user_by_email(session, current_email)
#             user_chats = user.get_chats()
#             user_chats = [chat.to_dict() for chat in user_chats]
#         return Response(
#             json.dumps(user_chats),
#             status=200, mimetype='application/json'
#         )

create_private_chat_parser = api.parser()
create_private_chat_parser.add_argument('user_email', type=str, help='User Email', location='json', required=True)

class CreatePrivateChatEndpoint(Resource):
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
                "user_email": "foo2@gmail.com"
            }
            """
    )
    @api.expect(create_private_chat_parser)
    @jwt_required()
    def post(self):
        """ Create private chat between two users """
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

create_group_chat_parser = api.parser()
create_group_chat_parser.add_argument('group_name', type=str, help='Group Name', location='json', required=True)
create_group_chat_parser.add_argument('user_emails', type=list, help='User Emails', location='json', required=True)

class CreateGroupChatEndpoint(Resource):
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
                "group_name": "The Three Musketeers",
                "user_emails": ["foo2@gmail.com", "bar@gmail.com"]
            }
            """
    )
    @api.expect(create_group_chat_parser)
    @jwt_required()
    def post(self):
        """ Create group chat between one or more emails """
        data = request.get_json()
        group_name = data.get('group_name')
        user_emails = data.get('user_emails')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                new_chat_id = Chat.create_group_chat(session, group_name, current_email, user_emails)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'chat_id': new_chat_id}),
            status=200, mimetype='application/json'
        )