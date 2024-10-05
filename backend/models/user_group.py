from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class UserGroup(db.Model):
    __tablename__ = 'user_groups'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'), primary_key=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    user = relationship("User", back_populates="group_associations")
    group = relationship("Group", back_populates="user_associations")
    
    def __repr__(self):
        return f'<User: {self.user_id}, Group: {self.group_id}>'