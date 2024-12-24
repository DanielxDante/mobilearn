from app import socketio

# def send_push_notification(chat_id, message):
#     # Integrate with Firebase Cloud Messaging or similar service
#     chat_members = ChatMember.query.filter_by(chat_id=chat_id).all()
    
#     for member in chat_members:
#         # Skip the sender
#         if member.user_id != message.sender_id:
#             # Send push notification to device tokens
#             send_fcm_notification(
#                 device_token=member.user.device_token,
#                 title=f"New message in {message.chat.name or 'Chat'}",
#                 body=message.content
#             )

# from flask_socketio import SocketIO, join_room, leave_room, emit

# socketio = SocketIO(app, cors_allowed_origins="*")

# @socketio.on('connect')
# def handle_connect():
#     # Verify user authentication via JWT
#     user_id = verify_jwt_in_socket()
#     if not user_id:
#         return False

# @socketio.on('join_chat')
# def on_join(data):
#     chat_id = data['chat_id']
#     user_id = verify_jwt_in_socket()
    
#     # Verify user is a member of the chat
#     chat_member = ChatMember.query.filter_by(
#         user_id=user_id, 
#         chat_id=chat_id
#     ).first()
    
#     if chat_member:
#         join_room(f'chat_{chat_id}')

# @socketio.on('send_message') # sync with function in model
# def handle_message(data):
#     chat_id = data['chat_id']
#     message_content = data['message']
#     user_id = verify_jwt_in_socket()
    
#     # Create and save message (similar to HTTP route logic)
#     new_message = Message(
#         chat_id=chat_id,
#         sender_id=user_id,
#         content=message_content
#     )
#     db.session.add(new_message)
#     db.session.commit()
    
#     # Broadcast to all members in the chat room
#     emit('new_message', {
#         'chat_id': chat_id,
#         'message_id': new_message.id,
#         'sender_id': user_id,
#         'content': message_content,
#         'timestamp': new_message.timestamp.isoformat()
#     }, room=f'chat_{chat_id}')