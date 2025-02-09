from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base

class Message(Base):
    # Only text messages for now
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('chat_participants.id'), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    # Many-to-one relationship with ChatParticipant
    sender = relationship("ChatParticipant", back_populates="sent_messages")

    # Many-to-one relationship with Chat
    chat = relationship("Chat", back_populates="messages")

    @staticmethod
    def get_messages(session):
        return session.query(Message).all()
    
    @staticmethod
    def get_message_by_id(session, id):
        return session.query(Message).filter_by(id=id).first()
    
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
    def add_message(session, chat_id, sender_id, content):
        new_message = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content
        )
        session.add(new_message)
        session.flush()

        return new_message

    @staticmethod
    def change_content(session, message_id, new_content):
        message = Message.get_message_by_id(session, message_id)
        if not message:
            raise ValueError(f'Message with id {message_id} not found')
        
        message.content = new_content
        session.flush()

    @staticmethod
    def delete_message(session, message_id):
        message = Message.get_message_by_id(session, message_id)
        session.delete(message)
        session.flush()

    def __repr__(self):
        return f'<User: {self.user_id}, Group: {self.group_id}>'
