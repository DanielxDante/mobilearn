from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base

class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    # Many-to-one relationship with User and Chat
    sender = relationship("User", back_populates="sent_messages")
    chat = relationship("Chat", back_populates="messages")

    @staticmethod
    def get_messages(session):
        return session.query(Message).all()
    
    @staticmethod
    def get_messages_by_chat_id(session, chat_id):
        return session.query(Message).filter_by(chat_id=chat_id).all()
    
    @staticmethod
    def get_messages_by_sender_id(session, sender_id):
        return session.query(Message).filter_by(sender_id=sender_id).all()
    
    @staticmethod
    def get_messages_by_chat_id_and_sender_id(session, chat_id, sender_id):
        return session.query(Message).filter_by(chat_id=chat_id, sender_id=sender_id).all()
    
    @staticmethod
    def add_message(session, chat_id, sender_email, content):
        sender = User.get_user_by_email(session, sender_email)
        if not sender:
            raise ValueError(f'User with email {sender_email} not found')
        
        sender_chat = session.query(UserChat).filter_by(user_id=sender.id, chat_id=chat_id).first()
        if not sender_chat:
            raise ValueError(f'User {sender_email} is not a member of chat {chat_id}')

        new_message = Message(
            chat_id=chat_id,
            sender_id=sender.id,
            content=content
        )
        session.add(new_message)
        session.flush()

    @staticmethod
    def edit_message(session, message_id, content):
        message = session.query(Message).filter_by(id=message_id).first()
        message.content = content
        session.flush()

    @staticmethod
    def delete_message(session, message_id):
        message = session.query(Message).filter_by(id=message_id).first()
        session.delete(message)
        session.flush()

    def __repr__(self):
        return f'<User: {self.user_id}, Group: {self.group_id}>'
