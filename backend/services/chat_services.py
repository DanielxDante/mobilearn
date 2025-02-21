from collections import deque
from sqlalchemy import or_, and_, not_, func, union_all
from sqlalchemy.sql.expression import bindparam

from models.user import User, STATUS as USER_STATUS
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.chat import Chat
from models.chat_participant import ChatParticipant
from models.message import Message

class ChatServiceError(Exception):
    pass

class ChatService:
    @staticmethod
    def search_participants(
        session,
        searcher_email,
        searcher_type,
        search_term,
        page,
        per_page
    ):
        """ Get all participant emails """
        offset = (page - 1) * per_page

        users_query = (
            session.query(
                User.id.label('id'),
                User.email.label('email'),
                User.name.label('name'),
                User.profile_picture_url.label('profile_picture_url')
            )
            .filter(
                User.email.ilike(f'%{search_term}%'),
                User.status == USER_STATUS.ACTIVE
            )
        )
        if searcher_type == 'user':
            users_query = users_query.filter(User.email != searcher_email)

        user_type_param = bindparam('user_type', value='user')
        users_query = users_query.add_columns(user_type_param.label('participant_type'))

        instructors_query = (
            session.query(
                Instructor.id.label('id'),
                Instructor.email.label('email'),
                Instructor.name.label('name'),
                Instructor.profile_picture_url.label('profile_picture_url')
            )
            .filter(
                Instructor.email.ilike(f'%{search_term}%'),
                Instructor.status == INSTRUCTOR_STATUS.ACTIVE
            )
        )
        if searcher_type == 'instructor':
            instructors_query = instructors_query.filter(Instructor.email != searcher_email)
        
        instructor_type_param = bindparam('instructor_type', value='instructor')
        instructors_query = instructors_query.add_columns(instructor_type_param.label('participant_type'))

        combined_query = union_all(users_query, instructors_query)

        paginated_participants = session.execute(
            combined_query
            .order_by(combined_query.c.name)
            .offset(offset)
            .limit(per_page)
        ).all()
     
        return paginated_participants

    @staticmethod
    def get_participant_chats(session, participant_email, participant_type):
        """ Get all chats a participant is in """
        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid participant type')

        if participant_type == 'user':
            participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_email(session, participant_email)
        if not participant:
            raise ValueError(f'Chat participant with email {participant_email} not found')

        participant_chats = (
            session.query(Chat)
            .join(ChatParticipant)
            .filter(
                ChatParticipant.participant_id == participant.id,
                ChatParticipant.participant_type == participant_type
            )
            .all()
        )

        private_chats_info = []
        group_chats_info = []

        combined_chats_info = private_chats_info + group_chats_info
        combined_chats_info.sort(key=lambda x: x['last_message_timestamp'], reverse=True)

        for chat in participant_chats:
            chat_latest_message = ChatService.get_chat_latest_message(session, chat.id)

            if chat.is_group:
                group_chats_info.append({
                    'chat_id': chat.id,
                    'is_group': True,
                    'chat_name': chat.name,
                    'chat_picture_url': chat.chat_picture_url,
                    'latest_message_content': chat_latest_message.content if chat_latest_message else None,
                    'latest_message_sender': chat_latest_message.sender.underlying_user.name if chat_latest_message else None,
                    'latest_message_timestamp': chat_latest_message.timestamp.isoformat() if chat_latest_message else None,
                    'unread_count': ChatService.get_unread_count(session, participant.id, participant_type, chat.id)
                })
            else:
                # do not display to user if private chat has no messages
                if not chat.messages:
                    continue

                for chat_participant in chat.participants:
                    if participant != chat_participant.underlying_user:
                        other_participant = chat_participant.underlying_user
            
                if other_participant:
                    private_chats_info.append({
                        'chat_id': chat.id,
                        'is_group': False,
                        'chat_name': other_participant.name,
                        'chat_picture_url': other_participant.profile_picture_url,
                        'latest_message_content': chat_latest_message.content if chat_latest_message else None,
                        'latest_message_sender': chat_latest_message.sender.underlying_user.name if chat_latest_message else None,
                        'latest_message_timestamp': chat_latest_message.timestamp.isoformat() if chat_latest_message else None,
                        'unread_count': ChatService.get_unread_count(session, participant.id, participant_type, chat.id)
                    })
        
        return private_chats_info + group_chats_info
    
    @staticmethod
    def get_chat_details(session, initiator_email, initiator_type, chat_id):
        """ 
        Get chat details
        Participant information will be listed with the initiator first 
        """
        if initiator_type not in ['user', 'instructor']:
            raise ValueError('Invalid participant type')

        if initiator_type == 'user':
            initiator = User.get_user_by_email(session, initiator_email)
        elif initiator_type == 'instructor':
            initiator = Instructor.get_instructor_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'Chat initiator with email {initiator_email} not found')
        
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        initiator_chat = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat_id,
                participant_id=initiator.id,
                participant_type=initiator_type
            )
            .first()
        )
        if not initiator_chat:
            raise ValueError(f'User {initiator_email} is not a member of chat {chat_id}')
        
        participants = deque()
        for participant in chat.participants:
            if participant.participant_id == initiator.id and participant.participant_type == initiator_type:
                participants.appendleft(participant)
            else:
                participants.append(participant)

        if chat.is_group:
            chat_name = chat.name
            chat_picture_url = chat.chat_picture_url
        else:
            chat_name = participants[-1].underlying_user.name if participants[-1] else 'Deleted User'
            chat_picture_url = participants[-1].underlying_user.profile_picture_url if participants[-1] else ''
        
        return {
            'chat_id': chat.id,
            'is_group': chat.is_group,
            'chat_name': chat_name,
            'chat_picture_url': chat_picture_url,
            'created': chat.created.isoformat(),
            'participants': [{
                'participant_id': participant.id,
                'participant_type': participant.participant_type,
                'participant_name': participant.underlying_user.name,
                'participant_email': participant.underlying_user.email,
                'participant_profile_picture_url': participant.underlying_user.profile_picture_url,
                'is_admin': participant.is_admin
            } for participant in participants]
        }
    
    @staticmethod
    def check_admin(session, participant_email, participant_type, chat_id):
        """ Check if a user or instructor is an admin of a chat """
        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid participant type')

        if participant_type == 'user':
            participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_email(session, participant_email)
        if not participant:
            raise ValueError(f'Chat participant with email {participant_email} not found')
        
        participant_chat = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat_id,
                participant_id=participant.id,
                participant_type=participant_type
            )
            .first()
        )

        if not participant_chat:
            raise ValueError(f'Chat participant {participant_email} is not part of chat {chat_id}')
        
        return participant_chat.is_admin

    @staticmethod
    def create_private_chat(session, initiator_email, initiator_type, participant_email, participant_type):
        """ Create a private chat between two users """
        if initiator_type not in ['user', 'instructor']:
            raise ValueError('Invalid initiator type')

        if initiator_type == 'user':
            initiator = User.get_user_by_email(session, initiator_email)
        elif initiator_type == 'instructor':
            initiator = Instructor.get_instructor_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'Chat initiator with email {initiator_email} not found')
        
        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid participant type')

        if participant_type == 'user':
            other_participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            other_participant = Instructor.get_instructor_by_email(session, participant_email)
        if not other_participant:
            raise ValueError(f'Chat participant with email {participant_email} not found')

        existing_chat = (
            session.query(Chat)
            .join(ChatParticipant)
            .filter(
            Chat.is_group == False,
                or_(
                    and_(
                        ChatParticipant.participant_id == initiator.id,
                        ChatParticipant.participant_type == initiator_type
                    ),
                    and_(
                        ChatParticipant.participant_id == other_participant.id,
                        ChatParticipant.participant_type == participant_type
                    )
                )
            )
            .group_by(Chat.id)
            .having(func.count(ChatParticipant.participant_id) == 2)
            .first()
        )

        if existing_chat:
            return existing_chat

        new_chat = Chat.add_chat(
            session,
            is_group=False
        )

        initiator_chat = ChatParticipant(
            chat_id=new_chat.id,
            participant_id=initiator.id,
            participant_type=initiator_type,
            is_admin=False
        )
        other_participant_chat = ChatParticipant(
            chat_id=new_chat.id,
            participant_id=other_participant.id,
            participant_type=participant_type,
            is_admin=False
        )
        session.add_all([initiator_chat, other_participant_chat])
        session.flush()

        return new_chat

    @staticmethod
    def create_group_chat(session, group_name, initiator_email, initiator_type, participant_info):
        """ Create a group chat """
        if initiator_type not in ['user', 'instructor']:
            raise ValueError('Invalid initiator type')

        if initiator_type == 'user':
            initiator = User.get_user_by_email(session, initiator_email)
        elif initiator_type == 'instructor':
            initiator = Instructor.get_instructor_by_email(session, initiator_email)
        if not initiator:
            raise ValueError(f'Chat initiator with email {initiator_email} not found')
        
        new_chat = Chat.add_chat(
            session,
            is_group=True,
            name=group_name
        )
        session.flush()

        initiator_chat = ChatParticipant(
            chat_id=new_chat.id,
            participant_id=initiator.id,
            participant_type=initiator_type,
            is_admin=True
        )
        session.add(initiator_chat)
        session.flush()

        for participant in participant_info:
            participant_email = participant['participant_email']
            participant_type = participant['participant_type']

            if participant_type not in ['user', 'instructor']:
                raise ValueError('Invalid participant type')

            if participant_type == 'user':
                other_participant = User.get_user_by_email(session, participant_email)
            elif participant_type == 'instructor':
                other_participant = Instructor.get_instructor_by_email(session, participant_email)
            if not other_participant:
                raise ValueError(f'Chat participant with email {participant_email} not found')

            other_participant_chat = ChatParticipant(
                chat_id=new_chat.id,
                participant_id=other_participant.id,
                participant_type=participant_type,
                is_admin=False
            )

            session.add(other_participant_chat)
            session.flush()

        return new_chat

    @staticmethod
    def add_participant_to_chat(session, chat_id, participant_email, participant_type):
        """ Add a participant to a group chat """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')
        if not chat.is_group:
            raise ValueError('Cannot add participants to private chat')

        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid initiator type')

        if participant_type == 'user':
            participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_email(session, participant_email)
        if not participant:
            raise ValueError(f'Participant with email {participant_email} not found')

        participant_chat = ChatParticipant(
            chat_id=chat.id,
            participant_id=participant.id,
            participant_type=participant_type,
            is_admin=False
        )
        session.add(participant_chat)
        session.flush()

        return participant_chat
    
    @staticmethod
    def remove_participant_from_chat(session, chat_id, participant_email, participant_type):
        """ Remove a participant from a group chat """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')
        if not chat.is_group:
            raise ValueError('Cannot remove participant from private chat')
        
        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid initiator type')

        if participant_type == 'user':
            participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_email(session, participant_email)
        if not participant:
            raise ValueError(f'Participant with email {participant_email} not found')

        chat_participant = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat.id,
                participant_id=participant.id,
                participant_type=participant_type
            )
            .first()
        )
        if not chat_participant:
            raise ValueError('Participant not found in chat')
        
        if chat_participant.is_admin:
            other_admins = (
                session.query(ChatParticipant)
                .filter(
                    ChatParticipant.chat_id == chat.id,
                    ChatParticipant.participant_id != participant.id,
                    ChatParticipant.is_admin == True
                )
                .first()
            )

            if not other_admins:
                new_admin = (
                    session.query(ChatParticipant)
                    .filter(
                        ChatParticipant.chat_id == chat.id,
                        ChatParticipant.participant_id != participant.id,
                    )
                    .order_by(ChatParticipant.joined.desc())
                    .first()
                )

                if new_admin:
                    new_admin.is_admin = True
                else:
                    session.delete(chat)
                    session.flush()
                
        session.delete(chat_participant)
        session.flush()
    
    @staticmethod
    def elevate_participant_to_admin(session, chat_id, participant_email, participant_type):
        """ Elevate a group chat member to admin """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')
        if not chat.is_group:
            raise ValueError('Cannot remove participant from private chat')
        
        if participant_type not in ['user', 'instructor']:
            raise ValueError('Invalid initiator type')

        if participant_type == 'user':
            participant = User.get_user_by_email(session, participant_email)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_email(session, participant_email)
        if not participant:
            raise ValueError(f'Participant with email {participant_email} not found')

        participant_chat = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat.id,
                participant_id=participant.id,
                participant_type=participant_type
            )
            .first()
        )
        if participant_chat:
            participant_chat.is_admin = True

        session.flush()

        return participant_chat
    
    @staticmethod
    def get_chat_latest_message(session, chat_id):
        """ Get the latest message in a chat """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError('Chat not found')

        lastest_chat_message = (
            session.query(Message)
            .filter_by(chat_id=chat.id)
            .order_by(Message.timestamp.desc())
            .first()
        )

        return lastest_chat_message if lastest_chat_message else None
    
    @staticmethod
    def get_unread_count(session, participant_id, participant_type, chat_id):
        """ Get the number of unread messages by a participant in a chat """
        if participant_type == 'user':
            participant = User.get_user_by_id(session, participant_id)
        elif participant_type == 'instructor':
            participant = Instructor.get_instructor_by_id(session, participant_id)
        
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError('Chat not found')

        participant_chat = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat_id,
                participant_id=participant.id,
                participant_type=participant_type
            )
            .first()
        )

        if not participant_chat:
            raise ValueError('User not in chat')

        unread_count = (
            session.query(Message)
            .filter(
                Message.chat_id == chat_id,
                Message.timestamp > participant_chat.last_read
            )
            .count()
        )

        return unread_count
    
    @staticmethod
    def update_last_read(session, chat_id, chat_participant_id):
        """ Update the last read timestamp of a participant in a chat """
        participant_chat = (
            session.query(ChatParticipant)
            .filter_by(
                chat_id=chat_id,
                id=chat_participant_id
            )
            .first()
        )
        if participant_chat:
            participant_chat.last_read = func.now()
            session.commit()

    @staticmethod
    def get_chat_messages(session, chat_id, page, per_page):
        """ Get paginated chat messages """
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError('Chat not found')

        offset = (page - 1) * per_page

        messages = (
            session.query(Message)
            .filter_by(chat_id=chat_id)
            .order_by(Message.timestamp.asc())
            .offset(offset)
            .limit(per_page)
            .all()
        )

        return messages
