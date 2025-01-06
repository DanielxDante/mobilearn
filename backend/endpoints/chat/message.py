import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api, socketio
from database import session_scope, create_session
from models.user import User
from models.chat import Chat
from models.message import Message
from services.chat_services import ChatService

@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_chat')
def handle_join_chat(data):
    # verify user is part of chat
    # get paginated messages
    pass

@socketio.on('leave_chat')
def handle_leave_chat(data):
    pass

@socketio.on('send_message')
def handle_send_message(data):
    pass

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
        }
    )
    @jwt_required()
    def get(self, chat_id):
        """ Get paginated chat messages """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        current_email = get_jwt_identity()

        session = create_session()

        try:
            messages = ChatService.get_chat_messages(
                session,
                initiator_email=current_email,
                chat_id=chat_id,
                page=page,
                per_page=per_page
            )
            return Response(
                json.dumps({'messages': [{
                    'id': message.id,
                    'sender_id': message.sender_id,
                    'content': message.content,
                    'timestamp': message.timestamp
                } for message in messages]}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({'error': str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()
        
