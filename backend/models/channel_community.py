from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class ChannelCommunity(db.Model):
    __tablename__ = 'channel_communities'

    channel_id = Column(Integer, ForeignKey('channels.id'), primary_key=True)
    community_id = Column(Integer, ForeignKey('communities.id'), primary_key=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    channel = relationship("Channel", back_populates="community_associations")
    community = relationship("Community", back_populates="channel_associations")
    
    def __repr__(self):
        return f'<Channel: {self.channel_id}, Community: {self.community_id}>'