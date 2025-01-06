from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime, func

from database import Base

class UserChat(Base):
    # Association table between User and Chat
    __tablename__ = 'user_chats'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id', ondelete='CASCADE'), primary_key=True)
    is_admin = Column(Boolean, nullable=False, default=False) # False for both users in private chats
    joined = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    last_read = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<(UserChat) User: {self.user_id}, Chat: {self.chat_id}>'