import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from flask_socketio import join_room, leave_room, emit

from app import api, socketio
from database import session_scope, create_session
from models.user import User
from models.chat import Chat
from models.message import Message
from services.chat_services import ChatService

active_users = {} # {chat_id: set(user_emails)}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_chat')
def handle_join_chat(data):
    """ Join chat room """
    chat_id = data['chat_id']
    user_email = data['user_email']

    join_room(chat_id)

    if chat_id not in active_users:
        active_users[chat_id] = set()
    active_users[chat_id].add(user_email)

    with session_scope() as session:
        ChatService.update_last_read(session, user_email, chat_id)

    emit('user_joined', {'user_email': user_email}, room=chat_id)

@socketio.on('leave_chat')
def handle_leave_chat(data):
    """ Leave chat room """
    chat_id = data['chat_id']
    user_email = data['user_email']

    leave_room(chat_id)

    if chat_id in active_users:
        active_users[chat_id].remove(user_email)
        if not active_users[chat_id]:
            del active_users[chat_id]
    
    with session_scope() as session:
        ChatService.update_last_read(session, user_email, chat_id)

    # emit('user_left', {'user_email': user_email}, room=chat_id)

@socketio.on('send_message')
def handle_send_message(data):
    """ Send message to chat room """
    chat_id = data['chat_id']
    user_email = data['user_email']
    content = data['content']

    if not isinstance(content, str):
        emit('error', {'message': 'Content must be a string'}, room=chat_id)
        return

    with session_scope() as session:
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            emit('error', {'message': 'Chat not found'}, room=chat_id)
            return

        user = User.get_user_by_email(session, user_email)
        if not user:
            emit('error', {'message': 'User not found'}, room=chat_id)
            return

        new_message = Message.add_message(
            session,
            chat_id=chat_id,
            sender_id=user.id,
            content=content
        )
    
        if chat_id in active_users:
            for email in active_users[chat_id]:
                if email != user_email:
                    ChatService.update_last_read(session, email, chat_id)

    emit('message_sent', {
        'message_id': new_message.id,
        'sender_email': user_email,
        'content': new_message.content,
        'timestamp': new_message.timestamp.isoformat()
    }, room=chat_id)

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
        
