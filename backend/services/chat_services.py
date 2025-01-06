from sqlalchemy import or_, not_, func

from models.user import User
from models.chat import Chat
from models.user_chat import UserChat
from models.message import Message

class ChatServiceError(Exception):
    pass

class ChatService:
    @staticmethod
    def get_user_chats(session, user_email):
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError(f'User with email {user_email} not found')

        user_chats = (
            session.query(Chat)
            .join(UserChat)
            .filter(
                UserChat.user_id == user.id
            )
            .all()
        )

        private_chats_info = []
        group_chats_info = []

        for chat in user_chats:
            if chat.is_group:
                group_chats_info.append({
                    'chat_id': chat.id,
                    'is_group': True,
                    'name': chat.name,
                    'picture_url': chat.chat_picture_url,
                    'last_message_timestamp': ChatService.get_chat_last_message_timestamp(session, chat.id),
                    'unread_count': ChatService.get_unread_count(session, user.id, chat.id)
                })
            else:
                member = (
                    session.query(User)
                    .join(UserChat)
                    .filter(
                        UserChat.chat_id == chat.id,
                        UserChat.user_id != user.id
                    )
                    .first()
                )

                if member:
                    private_chats_info.append({
                        'chat_id': chat.id,
                        'is_group': False,
                        'name': member.name,
                        '_picture_url': member.profile_picture_url,
                        'last_message_timestamp': ChatService.get_chat_last_message_timestamp(session, chat.id),
                        'unread_count': ChatService.get_unread_count(session, user.id, chat.id)
                    })
            
        return private_chats_info + group_chats_info
    
    @staticmethod
    def get_chat_details(session, initiator_email, chat_id):
        """ Get chat details including members """
        initiator = User.get_user_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'User with email {initiator_email} not found')
        
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        initiator_chat = (
            session.query(UserChat)
            .filter_by(
                user_id=initiator.id,
                chat_id=chat_id
            )
            .first()
        )

        if not initiator_chat:
            raise ValueError(f'User {initiator_email} is not a member of chat {chat_id}')
        
        if chat.is_group:
            chat_name = chat.name
            members = (
                session.query(User, UserChat.is_admin)
                .join(UserChat)
                .filter_by(chat_id=chat_id)
                .all()
            )
        else:
            member = (
                session.query(User, UserChat.is_admin)
                .join(UserChat)
                .filter(
                    UserChat.chat_id == chat_id,
                    UserChat.user_id != initiator.id
                )
                .first()
            )
            chat_name = member.name if member else 'Deleted User'
            members = [member]

        return {
            'chat_id': chat.id,
            'is_group': chat.is_group,
            'name': chat_name,
            'picture_url': chat.chat_picture_url,
            'created': chat.created,
            'members': [{
                'user_id': member.id,
                'name': member.name,
                'email': member.email,
                'picture_url': member.profile_picture_url,
                'is_admin': member.is_admin
            } for member in members]
        }

    @staticmethod
    def create_private_chat(session, initiator_email, member_email):
        """ Create a private chat between two users """
        initiator = User.get_user_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'User with email {initiator_email} not found')
        
        member = User.get_user_by_email(session, member_email)
        if not member:
            raise ValueError(f'User with email {member_email} not found')
        
        existing_chat = (
            session.query(Chat)
            .join(UserChat)
            .filter(
                Chat.is_group == False,
                or_(
                    UserChat.user_id == initiator.id,
                    UserChat.user_id == member.id
                )
            )
            .group_by(Chat.id)
            .having(func.count(UserChat.user_id) == 2)
            .first()
        )

        if existing_chat:
            return existing_chat

        new_chat = Chat.add_chat(
            session,
            is_group=False
        )
        session.add(new_chat)
        session.flush()

        initiator_chat = UserChat(
            user_id=initiator.id,
            chat_id=new_chat.id,
            is_admin=False
        )
        member_chat = UserChat(
            user_id=member.id,
            chat_id=new_chat.id,
            is_admin=False
        )
        session.add_all([initiator_chat, member_chat])
        session.flush()

        return new_chat

    @staticmethod
    def create_group_chat(session, group_name, initiator_email, member_emails=[]):
        initiator = User.get_user_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'User with email {initiator_email} not found')
        
        new_chat = Chat(
            is_group=True,
            name=group_name
        )
        session.add(new_chat)
        session.flush()

        initiator_chat = UserChat(
            user_id=initiator.id,
            chat_id=new_chat.id,
            is_admin=True
        )
        session.add(initiator_chat)
        session.flush()

        for member_email in member_emails:
            member = User.get_user_by_email(session, member_email)
            if not member:
                raise ValueError(f'User with email {member_email} not found')

            member_chat = UserChat(
                user_id=member.id,
                chat_id=new_chat.id,
                is_admin=False
            )
            session.add(member_chat)
        session.flush()

        return new_chat

    @staticmethod
    def add_user_to_chat(session, chat_id, user_email):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError(f'User with email {user_email} not found')

        user_chat = UserChat(
            user_id=user.id,
            chat_id=chat.id,
            is_admin=False
        )
        chat.users.append(user_chat)
        session.flush()
    
    @staticmethod
    def remove_user_from_chat(session, chat_id, user_email):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError(f'User with email {user_email} not found')

        user_chat = session.query(UserChat).filter_by(user_id=user.id, chat_id=chat.id).first()
        if user_chat:
            chat.users.remove(user_chat)

        # Remove chat if no users left
        if not chat.users:
            session.delete(chat)

        session.flush()
    
    @staticmethod
    def get_chat_last_message_timestamp(session, chat_id):
        """ Get the timestamp of the last message in a chat """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError('Chat not found')

        last_chat_message = (
            session.query(Message)
            .filter_by(chat_id=chat.id)
            .order_by(Message.timestamp.desc())
            .first()
        )

        return last_chat_message.timestamp if last_chat_message else None
    
    @staticmethod
    def get_unread_count(session, user_id, chat_id):
        """ Get the number of unread messages by a user in a chat """
        user = User.get_user_by_id(session, user_id)
        if not user:
            raise ValueError('User not found')
        
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError('Chat not found')

        user_chat = (
            session.query(UserChat)
            .filter_by(user_id=user_id, chat_id=chat_id)
            .first()
        )

        if not user_chat:
            raise ValueError('User not in chat')

        unread_count = (
            session.query(Message)
            .filter(
                Message.chat_id == chat_id,
                Message.timestamp > user_chat.last_read
            )
            .count()
        )

        return unread_count

