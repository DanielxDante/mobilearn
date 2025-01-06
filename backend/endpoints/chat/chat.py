import json
import datetime
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
from services.user_services import UserService
from services.chat_services import ChatService

class SearchUsersEndpoint(Resource):
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
            },
            'search_term': {
                'in': 'query',
                'description': 'Search term for users',
                'required': True
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of users per page',
                'required': False
            }
        },
    )
    @jwt_required()
    def get(self):
        """ Search for users """
        search_term = request.args.get('search_term', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            users = UserService.search_users(
                session,
                searcher_email=current_email,
                search_term=search_term,
                page=page,
                per_page=per_page
            )
            user_info = [{
                'id': user.id,
                'email': user.email,
                'name': user.name
            } for user in users]
            return Response(
                json.dumps({'users': user_info}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()
    
class GetUserChatsEndpoint(Resource):
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
        """ Get all chats for user """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            user = User.get_user_by_email(session, current_email)
            user_chats = ChatService.get_user_chats(session, user.email)
            user_chats.sort(
                key=lambda x: datetime.strptime(
                    x['last_message_timestamp'],
                    '%Y-%m-%d %H:%M:%S'
                ), 
                reverse=True
            )
            return Response(
                json.dumps({'chats': user_chats}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

class GetChatDetailsEndpoint(Resource):
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
    def get(self, chat_id):
        """ Get chat details """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            chat_info = ChatService.get_chat_details(
                session,
                initiator_email=current_email,
                chat_id=chat_id
            )
            return Response(
                json.dumps({'chat_info': chat_info}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

create_private_chat_parser = api.parser()
create_private_chat_parser.add_argument('member_email', type=str, help='Member Email', location='json', required=True)

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
                "member_email": "foo2@gmail.com"
            }
            """
    )
    @api.expect(create_private_chat_parser)
    @jwt_required()
    def post(self):
        """ Create private chat between two users """
        data = request.get_json()
        member_email = data.get('member_email')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                private_chat = ChatService.create_private_chat(
                    session,
                    initiator_email=current_email,
                    member_email=member_email
                )
                return Response(
                    json.dumps({
                        'chat_id': private_chat.id
                    }),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=500, mimetype='application/json'
                )
        
create_group_chat_parser = api.parser()
create_group_chat_parser.add_argument('group_name', type=str, help='Group Name', location='json', required=True)
create_group_chat_parser.add_argument('member_emails', type=list, help='Member Email(s)', location='json', required=True)

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
                "member_emails": ["foo2@gmail.com", "bar@gmail.com"]
            }
            """
    )
    @api.expect(create_group_chat_parser)
    @jwt_required()
    def post(self):
        """ Create group chat between one or more emails """
        data = request.get_json()
        group_name = data.get('group_name')
        member_emails = data.get('member_emails')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                group_chat = ChatService.create_group_chat(
                    session,
                    group_name=group_name,
                    initiator_email=current_email,
                    member_emails=member_emails
                )
                return Response(
                    json.dumps({
                        'chat_id': group_chat.id
                    }),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=500, mimetype='application/json'
                )
    
# class EditGroupChatNameEndpoint(Resource)
    
# class EditGroupChatPictureEndpoint(Resource)

# class AddGroupChatMemberEndpoint(Resource)
    
# class RemoveGroupChatMemberEndpoint(Resource)
    
# class DeleteGroupChatEndpoint(Resource)