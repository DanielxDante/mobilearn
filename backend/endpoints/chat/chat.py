import json
import datetime
from flask import Response, request
from werkzeug.datastructures import FileStorage
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
from utils.s3 import upload_file

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
                key=lambda x: datetime.datetime.fromisoformat(x['last_message_timestamp']),
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
create_group_chat_parser.add_argument('member_emails', type=str, location='json', required=True, action='append', help='Member Email(s)')

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

edit_group_chat_name_parser = api.parser()
edit_group_chat_name_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
edit_group_chat_name_parser.add_argument('new_group_name', type=str, help='New Group Name', location='json', required=True)

class EditGroupChatNameEndpoint(Resource):
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
                "chat_id": 1,
                "new_group_name": "The Three Slaves"
            }
            """
    )
    @api.expect(edit_group_chat_name_parser)
    @jwt_required()
    def post(self):
        """ Edit group chat name """
        data = request.get_json()
        chat_id = data.get('chat_id')
        new_group_name = data.get('new_group_name')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, current_email, chat_id):
                    raise ValueError('You are not an admin of this chat')
                Chat.change_name(session, chat_id, new_group_name)
                return Response(
                    json.dumps({'message': 'Group chat name successfully updated'}),
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

edit_group_chat_picture_parser = api.parser()
edit_group_chat_picture_parser.add_argument('chat_id', type=int, help='Chat ID', location='form', required=True)
edit_group_chat_picture_parser.add_argument('new_picture', type=FileStorage, location='files', required=True)

class EditGroupChatPictureEndpoint(Resource):
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
        }
    )
    @api.expect(edit_group_chat_picture_parser)
    @jwt_required()
    def post(self):
        """ Edit group chat picture """
        chat_id = request.form.get('chat_id')
        file = request.files.get('new_picture')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, current_email, chat_id):
                    raise ValueError('You are not an admin of this chat')
                
                new_chat_picture_url = upload_file(file, f'chat_{chat_id}')

                Chat.change_chat_picture(session, chat_id, new_chat_picture_url)
                return Response(
                    json.dumps({'message': 'Group chat picture successfully updated'}),
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

add_group_chat_member_parser = api.parser()
add_group_chat_member_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
add_group_chat_member_parser.add_argument(
    'new_member_emails',
    type=list,
    action='append',
    help='New Member Emails',
    location='json',
    required=True
)

class AddGroupChatMembersEndpoint(Resource):
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
                "chat_id": 1,
                "new_member_emails": ["bar2@gmail.com"]
            }
            """
    )
    @api.expect(add_group_chat_member_parser)
    @jwt_required()
    def post(self):
        """
        Add member(s) to group chat
        Only admins can add members
        """
        data = request.get_json()
        chat_id = data.get('chat_id')
        new_member_emails = data.get('new_member_emails')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, current_email, chat_id):
                    raise ValueError('You are not an admin of this chat')
                
                for member_email in new_member_emails:
                    ChatService.add_user_to_chat(session, chat_id, member_email)
                return Response(
                    json.dumps({'message': 'Member(s) successfully added to group chat'}),
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

remove_group_chat_member_parser = api.parser()
remove_group_chat_member_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
remove_group_chat_member_parser.add_argument('member_id', type=int, help='Member ID', location='json', required=True)

class RemoveGroupChatMemberEndpoint(Resource):
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
                "chat_id": 1,
                "member_id": 1
            }
            """
    )
    @api.expect(remove_group_chat_member_parser)
    @jwt_required()
    def post(self):
        """
        Remove member from group chat
        Admin can remove any member
        Anybody can remove themselves from a group chat
        """
        data = request.get_json()
        chat_id = data.get('chat_id')
        member_id = data.get('member_id')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                ChatService.remove_user_from_chat(session, chat_id, member_id)
                return Response(
                    json.dumps({'message': 'Member successfully removed from group chat'}),
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

elevate_group_chat_admin_parser = api.parser()
elevate_group_chat_admin_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
elevate_group_chat_admin_parser.add_argument('member_id', type=int, help='Member ID', location='json', required=True)

class ElevateGroupChatAdminEndpoint(Resource):
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
                "chat_id": 1,
                "member_id": 1
            }
            """
    )
    @api.expect(elevate_group_chat_admin_parser)
    @jwt_required()
    def post(self):
        """
        Elevate member to admin in group chat
        Only admins can elevate members to admin
        """
        data = request.get_json()
        chat_id = data.get('chat_id')
        member_id = data.get('member_id')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, current_email, chat_id):
                    raise ValueError('You are not an admin of this chat')
                
                ChatService.elevate_member_to_admin(session, chat_id, member_id)
                return Response(
                    json.dumps({'message': 'Member successfully elevated to admin in group chat'}),
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

