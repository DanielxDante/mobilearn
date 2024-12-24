from sqlalchemy import Column, Integer, ForeignKey, DateTime, func

from database import Base

class ChannelCommunity(Base):
    # Association table between Channel and Community
    __tablename__ = 'channel_communities'

    channel_id = Column(Integer, ForeignKey('channels.id'), primary_key=True)
    community_id = Column(Integer, ForeignKey('communities.id'), primary_key=True)
    attached = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<Channel: {self.channel_id}, Community: {self.community_id}>'