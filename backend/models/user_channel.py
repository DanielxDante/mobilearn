from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class UserChannel(db.Model):
    __tablename__ = 'user_channels'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    channel_id = Column(Integer, ForeignKey('channels.id'), primary_key=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    user = relationship("User", back_populates="channel_associations")
    channel = relationship("Channel", back_populates="user_associations")
    
    def __repr__(self):
        return f'<User: {self.user_id}, Channel: {self.channel_id}>'