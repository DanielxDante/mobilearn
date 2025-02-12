from sqlalchemy import Column, Integer, Boolean, String, DateTime, func
from sqlalchemy.orm import relationship

from database import Base

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True)
    is_group = Column(Boolean, nullable=False)
    name = Column(String, nullable=True) # null for private chats
    chat_picture_url = Column(String, nullable=True, default="") # null for private chats
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    # Many-to-many relationship with ChatParticipant
    participants = relationship("ChatParticipant", back_populates="chat", cascade="all, delete-orphan")

    # Many-to-one relationship with Message
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

    @staticmethod
    def get_chats(session):
        return session.query(Chat).all()
    
    @staticmethod
    def get_chat_by_id(session, id):
        return session.query(Chat).filter_by(id=id).first()
    
    @staticmethod
    def add_chat(session, is_group, **kwargs):
        new_chat = Chat(
            is_group=is_group,
            name=kwargs.get('name', ""),
            chat_picture_url=kwargs.get('chat_picture_url', "")
        )
        
        session.add(new_chat)

        return new_chat
    
    @staticmethod
    def change_name(session, chat_id, new_name):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')
        if not chat.is_group:
            raise ValueError('Cannot change name of private chat')
        
        chat.name = new_name
        session.flush()
    
    @staticmethod
    def change_chat_picture(session, chat_id, new_chat_picture_url):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')
        if not chat.is_group:
            raise ValueError('Cannot change picture of private chat')
        
        chat.chat_picture_url = new_chat_picture_url
        session.flush()
    
    @staticmethod
    def delete_chat(session, chat_id):
        chat = Chat.get_chat_by_id(session, chat_id)
        if not chat:
            raise ValueError(f'Chat with id {chat_id} not found')

        session.delete(chat)
        session.flush()

    def __repr__(self):
        return f'<Chat {self.name}>'