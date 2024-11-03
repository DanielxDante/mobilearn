from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, validates

from database import db
from community import Community

class School(db.Model):
    __tablename__ = 'schools'

    id = Column(Integer, primary_key=True)
    community_id = Column(Integer, ForeignKey('communities.id'), nullable=False)
    name = Column(String, nullable=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)

    # One-to-many relationship with Community
    community = relationship('Community', back_populates='schools')

    # One-to-many relationship with Program
    programs = relationship('Program', back_populates='school', cascade='all, delete-orphan')

    @validates('community_id')
    def validate_community(self, community_id):
        community = db.session.query(Community).get(id=community_id)
        if community.community_type != "university":
            raise ValueError("Community must be of type 'university'")
        return community_id

    def __repr__(self):
        return f'<Name: {self.name}, Community: {self.community_id}>'
    