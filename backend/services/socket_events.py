from flask import request
from flask_socketio import join_room, leave_room, emit

from database import session_scope, create_session
from models.chat import Chat
from models.message import Message
from models.chat_participant import ChatParticipant
from services.chat_services import ChatService
from services.notification_services import NotificationService

chat_rooms = {} # {chat_id: {chat_participant_id: sid}}
# Check for removed chat participants

def register_socket_handlers(socketio):
    @socketio.on('connect')
    def handle_connect():
        """ Run when a user logins or enters returns to a logged in session """
        print("New client connected")

    @socketio.on('disconnect')
    def handle_disconnect():
        print("Client disconnected")

    @socketio.on('join_chat')
    def handle_join_chat(data):
        """
        Run when a chat participant joins a chat
        data: {
            chat_id: int,
            chat_participant_id: int
        }
        """
        chat_id = data['chat_id']
        chat_participant_id = data['chat_participant_id']

        # record new chat room if it doesn't exist
        if chat_id not in chat_rooms:
            chat_rooms[chat_id] = {}
        
        # add chat participant to chat room
        chat_rooms[chat_id][chat_participant_id] = request.sid
        join_room(chat_id)

        print(f"Chat participant {chat_participant_id} joined chat {chat_id}")

        # update chat participant last read timestamp in chat
        # with session_scope() as session:
        #     ChatService.update_last_read(session, chat_id, chat_participant_id)

        emit('chat_participant_joined', {'chat_id': chat_id, 'chat_participant_id': chat_participant_id}, room=chat_id)

    @socketio.on('leave_chat')
    def handle_leave_chat():
        """
        Leave chat room
        """
        for chat_id, chat_participants in chat_rooms.items():
            for chat_participant_id, sid in chat_participants.items():
                if sid == request.sid:
                    # remove chat participant from chat room
                    del chat_participants[chat_participant_id]
                    leave_room(chat_id)

                    # update chat participant last read timestamp in chat
                    with session_scope() as session:
                        ChatService.update_last_read(session, chat_id, chat_participant_id)

                    print(f"Chat participant {chat_participant_id} left chat {chat_id}")
                    emit('chat_participant_left', {'chat_id': chat_id, 'chat_participant_id': chat_participant_id}, room=chat_id)
                    
                    break

    @socketio.on('send_message')
    def handle_send_message(data):
        """ 
        Send message by chat participant to chat
        data: {
            chat_id: int,
            chat_participant_id: int,
            content: str
        }
        """
        chat_id = data['chat_id']
        chat_participant_id = data['chat_participant_id']
        content = data['content']

        # check proper content
        if not isinstance(content, str):
            emit('error', {'message': 'Content must be a string'}, room=chat_id)
            return
        
        # check if chat participant is in chat room
        if chat_id not in chat_rooms or chat_participant_id not in chat_rooms[chat_id]:
            emit('error', {'message': 'Chat participant not in chat room'}, room=chat_id)
            return

        with session_scope() as session:
            sender = ChatParticipant.get_chat_participant_by_id(session, chat_participant_id)
            if not sender:
                emit('error', {'message': 'Chat participant not found'}, room=chat_id)
                return

            chat = Chat.get_chat_by_id(session, chat_id)
            if not chat:
                emit('error', {'message': 'Chat not found'}, room=chat_id)
                return

            # add message to database
            new_message = Message.add_message(
                session,
                chat_id=chat_id,
                sender_id=chat_participant_id,
                content=content
            )

        # send notification to everyone not in chat room
        chat_participants = chat.participants
        for chat_participant in chat_participants:
            if chat_participant.id != chat_participant_id:
                if chat_participant.id in chat_rooms[chat_id]:
                    continue

                NotificationService.add_notification(
                    session,
                    title=chat.name,
                    body=f"{chat_participant.underlying_user.name}: {content}",
                    notification_type="chat",
                    recipient_id=chat_participant.participant_id,
                    recipient_type=chat_participant.participant_type,
                )

        # broadcast message to everyone in the chat room
        emit('new_message', {
            'message_id': new_message.id,
            'sender_id': chat_participant_id,
            'content': new_message.content,
            'timestamp': new_message.timestamp.isoformat()
        }, room=chat_id)