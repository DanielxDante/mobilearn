from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base

class UserChat(Base):
    # Association table between User and Chat
    __tablename__ = 'user_chats'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), primary_key=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    joined = Column(DateTime, default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<User: {self.user_id}, Chat: {self.chat_id}>'