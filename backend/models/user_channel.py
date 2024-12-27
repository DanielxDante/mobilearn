from sqlalchemy import Column, Integer, ForeignKey, DateTime, func

from database import Base

class UserChannel(Base):
    # Association table between User and Channel
    __tablename__ = 'user_channels'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    channel_id = Column(Integer, ForeignKey('channels.id', ondelete='CASCADE'), primary_key=True)
    joined = Column(DateTime, default=func.now(), nullable=False)

    def __repr__(self):
        return f'<User: {self.user_id}, Channel: {self.channel_id}>'