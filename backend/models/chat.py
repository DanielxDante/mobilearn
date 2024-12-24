from sqlalchemy import Column, Integer, Boolean, String, DateTime, event, func
from sqlalchemy.orm import relationship, Session
from sqlalchemy.ext.associationproxy import association_proxy

from database import Base

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True)
    is_group = Column(Boolean, nullable=False, default=False)
    name = Column(String, nullable=False)
    chat_picture_url = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    # Many-to-many relationship with User
    users = relationship("User", secondary="user_chats", back_populates="chats")

    # One-to-many relationship with Message
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

    @staticmethod
    def get_chats(session):
        return session.query(Chat).all()
    
    @staticmethod
    def get_chat_by_id(session, id):
        return session.query(Chat).filter_by(id=id).first()

    # @staticmethod
    # def create_private_chat(session, owner_email, user_email):
    #     owner = User.get_user_by_email(session, owner_email)
    #     user = User.get_user_by_email(session, user_email)
    #     if not user:
    #         raise ValueError(f'User with email {user_email} not found')

    #     new_chat = Chat(
    #         is_group=False,
    #         name=user.name,
    #         chat_picture_url=user.profile_picture_url
    #     )

    #     owner_chat = UserChat(
    #         user_id=owner.id,
    #         chat_id=new_chat.id,
    #         is_admin=True
    #     )
    #     user_chat = UserChat(
    #         user_id=user.id,
    #         chat_id=new_chat.id,
    #         is_admin=False
    #     )
    #     new_chat.users.append(owner_chat)
    #     new_chat.users.append(user_chat)

    #     session.add(new_chat)
    #     session.flush()

    #     return new_chat.id

    # @staticmethod
    # def create_group_chat(session, name, owner_email, user_emails=[]):
    #     owner = User.get_user_by_email(session, owner_email)
    #     new_chat = Chat(
    #         is_group=True,
    #         name=name
    #     )

    #     owner_chat = UserChat(
    #         user_id=owner.id,
    #         chat_id=new_chat.id,
    #         is_admin=True
    #     )
    #     new_chat.users.append(owner_chat)

    #     for user_email in user_emails:
    #         user = User.get_user_by_email(session, user_email)
    #         if not user:
    #             raise ValueError(f'User with email {user_email} not found')

    #         user_chat = UserChat(
    #             user_id=user.id,
    #             chat_id=new_chat.id,
    #             is_admin=False
    #         )
    #         new_chat.users.append(user_chat)

    #     session.add(new_chat)
    #     session.flush()

    #     return new_chat.id

    # @staticmethod
    # def add_user_to_chat(session, chat_id, user_email):
    #     chat = Chat.get_chat_by_id(session, chat_id)
    #     if not chat:
    #         raise ValueError(f'Chat with id {chat_id} not found')

    #     user = User.get_user_by_email(session, user_email)
    #     if not user:
    #         raise ValueError(f'User with email {user_email} not found')

    #     user_chat = UserChat(
    #         user_id=user.id,
    #         chat_id=chat.id,
    #         is_admin=False
    #     )
    #     chat.users.append(user_chat)
    #     session.flush()
    
    # @staticmethod
    # def remove_user_from_chat(session, chat_id, user_email):
    #     chat = Chat.get_chat_by_id(session, chat_id)
    #     if not chat:
    #         raise ValueError(f'Chat with id {chat_id} not found')

    #     user = User.get_user_by_email(session, user_email)
    #     if not user:
    #         raise ValueError(f'User with email {user_email} not found')

    #     user_chat = session.query(UserChat).filter_by(user_id=user.id, chat_id=chat.id).first()
    #     if user_chat:
    #         chat.users.remove(user_chat)

    #     session.flush()
    
    @staticmethod
    def delete_chat(session, chat_id):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        session.delete(chat)
        session.flush()

    def __repr__(self):
        return f'<Chat {self.name}>'

# @event.listens_for(Session, "after_flush")
# def delete_empty_groups(session, context):
#     chats = session.query(Chat).all()
#     for chat in chats:
#         if len(chat.users) == 0:
#             session.delete(chat)
