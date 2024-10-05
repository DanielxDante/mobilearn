from sqlalchemy import Enum, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db
from . import STATUSES

COMMUNITY_TYPES = ("university", "company", "organization", "other")

class Community(db.Model):
    __tablename__ = 'communities'

    id = Column(Integer, primary_key=True)
    community_type = Column(Enum(*COMMUNITY_TYPES), nullable=False, default='university')
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    address = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    logo_url = Column(String, nullable=True) # CDN link to logo
    website_url = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    bank_account_name = Column(String, nullable=True)
    bank_account_number = Column(String, nullable=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    status = Column(Enum(*STATUSES), nullable=False, default='active')

    # Many-to-many relationship with Channel
    channel_associations = relationship("ChannelCommunity", back_populates="community")
    channels = association_proxy('channel_associations', 'channel')

    # One-to-many relationship with School
    schools = relationship("School", back_populates="community", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Name: {self.name}>'