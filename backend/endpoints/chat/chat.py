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
from models.instructor import Instructor
from models.chat import Chat
from services.chat_services import ChatService
from utils.s3 import upload_file

class SearchParticipantsEndpoint(Resource):
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
            'participant_type': {
                'in': 'query',
                'description': 'Search term for participants',
                'required': True
            },
            'search_term': {
                'in': 'query',
                'description': 'Search term for participants',
                'required': True
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of participants per page',
                'required': False
            }
        },
    )
    @jwt_required()
    def get(self):
        """ Search for participants """
        search_term = request.args.get('search_term', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        searcher_email = get_jwt_identity()
        searcher_type = request.args.get('participant_type')

        session = create_session()

        try:
            participants = ChatService.search_participants(
                session,
                searcher_email=searcher_email,
                searcher_type=searcher_type,
                search_term=search_term,
                page=page,
                per_page=per_page
            )

            participant_info = [{
                'id': participant[0],
                'email': participant[1],
                'name': participant[2],
                'profile_picture_url': participant[3],
                'participant_type': participant[4]
            } for participant in participants]
            return Response(
                json.dumps({'participants': participant_info}),
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
    
class GetParticipantChatsEndpoint(Resource):
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
    def get(self, participant_type):
        """ Get all chats for participant """
        participant_email = get_jwt_identity()

        session = create_session()

        try:
            participant_chats = ChatService.get_participant_chats(
                session,
                participant_email=participant_email,
                participant_type=participant_type
            )
            participant_chats.sort(
                key=lambda x: datetime.datetime.fromisoformat(x['latest_message_timestamp']) if x['latest_message_timestamp'] else datetime.datetime.min,
                reverse=True
            )
            return Response(
                json.dumps({'chats': participant_chats}),
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
    def get(self, initiator_type, chat_id):
        """ Get chat details """
        initiator_email = get_jwt_identity()

        session = create_session()

        try:
            chat_info = ChatService.get_chat_details(
                session,
                initiator_email=initiator_email,
                initiator_type=initiator_type,
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
create_private_chat_parser.add_argument('initiator_type', type=str, help='Initiator Type', location='json', required=True)
create_private_chat_parser.add_argument('participant_email', type=str, help='Participant Email', location='json', required=True)
create_private_chat_parser.add_argument('participant_type', type=str, help='Participant Type', location='json', required=True)

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
                "initiator_type": "user",
                "participant_email": "scott_piper@edu.com",
                "participant_type": "instructor"
            }
            """
    )
    @api.expect(create_private_chat_parser)
    @jwt_required()
    def post(self):
        """ Create private chat between two users """
        data = request.get_json()
        initiator_type = data.get('initiator_type')
        participant_email = data.get('participant_email')
        participant_type = data.get('participant_type')
        
        initiator_email = get_jwt_identity()

        with session_scope() as session:
            try:
                private_chat = ChatService.create_private_chat(
                    session,
                    initiator_email=initiator_email,
                    initiator_type=initiator_type,
                    participant_email=participant_email,
                    participant_type=participant_type
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
create_group_chat_parser.add_argument('initiator_type', type=str, help='Initiator Type', location='json', required=True)
create_group_chat_parser.add_argument('group_name', type=str, help='Group Name', location='json', required=True)
create_group_chat_parser.add_argument(
    'participant_info',
    type=list,
    action='append',
    location='json',
    required=True,
    help='List of participant emails and types'
)

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
                "initiator_type": "user",
                "group_name": "The Three Musketeers",
                "participant_info": [
                    {
                        "participant_email": "mobilearn_matthew@gmail.com",
                        "participant_type": "user"
                    },
                    {
                        "participant_email": "mobilearn_gerard@gmail.com",
                        "participant_type": "user"
                    }
                ]
            }
            """
    )
    @api.expect(create_group_chat_parser)
    @jwt_required()
    def post(self):
        """ Create group chat between one or more emails """
        data = request.get_json()
        initiator_type = data.get('initiator_type')
        group_name = data.get('group_name')
        participant_info = data.get('participant_info', [])
        
        initiator_email = get_jwt_identity()

        with session_scope() as session:
            try:
                group_chat = ChatService.create_group_chat(
                    session,
                    group_name=group_name,
                    initiator_email=initiator_email,
                    initiator_type=initiator_type,
                    participant_info=participant_info
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
edit_group_chat_name_parser.add_argument('participant_type', type=str, help='Participant Type', location='json', required=True)
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
                "participant_type": "user",
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
        participant_type = data.get('participant_type')
        chat_id = data.get('chat_id')
        new_group_name = data.get('new_group_name')
        
        participant_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, participant_email, participant_type, chat_id):
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
edit_group_chat_picture_parser.add_argument('participant_type', type=str, help='Participant Type', location='form', required=True)
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
        participant_type = request.form.get('participant_type')
        chat_id = request.form.get('chat_id')
        file = request.files.get('new_picture')

        participant_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, participant_email, participant_type, chat_id):
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

add_group_chat_participant_parser = api.parser()
add_group_chat_participant_parser.add_argument('initiator_type', type=str, help='Initiator Type', location='json', required=True)
add_group_chat_participant_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
add_group_chat_participant_parser.add_argument(
    'new_participant_info',
    type=list,
    action='append',
    help='New participant emails and types',
    location='json',
    required=True
)

class AddGroupChatParticipantsEndpoint(Resource):
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
                "initiator_type": "user",
                "chat_id": 1,
                "new_participant_info": [
                    {
                        "participant_email": "scott_piper@edu.com",
                        "participant_type": "instructor"
                    }
                ]
            }
            """
    )
    @api.expect(add_group_chat_participant_parser)
    @jwt_required()
    def post(self):
        """
        Add participant(s) to group chat
        Only admins can add participants
        """
        data = request.get_json()
        initiator_type = data.get('initiator_type')
        chat_id = data.get('chat_id')
        new_participant_info = data.get('new_participant_info', [])
        
        initiator_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, initiator_email, initiator_type, chat_id):
                    raise ValueError('You are not an admin of this chat')
                
                for participant in new_participant_info:
                    ChatService.add_participant_to_chat(session, chat_id, participant['participant_email'], participant['participant_type'])
                return Response(
                    json.dumps({'message': 'Participant(s) successfully added to group chat'}),
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

remove_group_chat_participant_parser = api.parser()
remove_group_chat_participant_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
remove_group_chat_participant_parser.add_argument('participant_email', type=str, help='Participant Email', location='json', required=True)
remove_group_chat_participant_parser.add_argument('participant_type', type=str, help='Participant Type', location='json', required=True)

class RemoveGroupChatParticipantEndpoint(Resource):
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
                "participant_email": "scott_piper@edu.com",
                "participant_type": "instructor"
            }
            """
    )
    @api.expect(remove_group_chat_participant_parser)
    @jwt_required()
    def post(self):
        """
        Remove participant from group chat
        Admin can remove any participant
        Anybody can remove themselves from a group chat
        """
        data = request.get_json()
        chat_id = data.get('chat_id')
        participant_email = data.get('participant_email')
        participant_type = data.get('participant_type')
        
        initiator_email = get_jwt_identity()

        with session_scope() as session:
            try:
                ChatService.remove_participant_from_chat(session, chat_id, participant_email, participant_type)

                return Response(
                    json.dumps({'message': 'Participant successfully removed from group chat'}),
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
elevate_group_chat_admin_parser.add_argument('initiator_type', type=str, help='Initiator Type', location='json', required=True)
elevate_group_chat_admin_parser.add_argument('chat_id', type=int, help='Chat ID', location='json', required=True)
elevate_group_chat_admin_parser.add_argument('participant_email', type=str, help='Participant Email', location='json', required=True)
elevate_group_chat_admin_parser.add_argument('participant_type', type=str, help='Participant Type', location='json', required=True)

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
                "initiator_type": "user",
                "chat_id": 1,
                "participant_email": "mobilearn_gerard@gmail.com",
                "participant_type": "user"
            }
            """
    )
    @api.expect(elevate_group_chat_admin_parser)
    @jwt_required()
    def post(self):
        """
        Elevate participant to admin in group chat
        Only admins can elevate participants to admin
        """
        data = request.get_json()
        initiator_type = data.get('initiator_type')
        chat_id = data.get('chat_id')
        participant_email = data.get('participant_email')
        participant_type = data.get('participant_type')
        
        initiator_email = get_jwt_identity()

        with session_scope() as session:
            try:
                if not ChatService.check_admin(session, initiator_email, initiator_type, chat_id):
                    raise ValueError('You are not an admin of this chat')
                
                ChatService.elevate_participant_to_admin(session, chat_id, participant_email, participant_type)

                return Response(
                    json.dumps({'message': 'Participant successfully elevated to admin in group chat'}),
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

