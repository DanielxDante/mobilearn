from sqlalchemy import Enum, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db
from . import STATUS

class Channel(db.Model):
    __tablename__ = 'channels'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    invite_code = Column(String, nullable=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    status = Column(Enum(STATUS), nullable=False, default=STATUS.ACTIVE)

    # Many-to-many relationship with User
    user_associations = relationship("UserChannel", back_populates="channel")
    users = association_proxy('user_associations', 'user')

    # Many-to-many relationship with Community
    community_associations = relationship("ChannelCommunity", back_populates="channel")
    communities = association_proxy('community_associations', 'community')

    @staticmethod
    def add_channel():
        pass

    @staticmethod   
    def get_channels():
        return Channel.query.all()

    @staticmethod
    def get_channel_by_id(id):
        return Channel.query.get(id)
    
    @staticmethod
    def get_channel_by_name(name):
        return Channel.query.filter_by(name=name).first()
    
    def __repr__(self):
        return f'<ID: {self.id}>, Channel: {self.name}, Invite_code: {self.invite_code}'