from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)

    # Many-to-Many relationship between Course
    course_associations = relationship("CourseSkill", back_populates="skill")
    courses = association_proxy('course_associations', 'course')

    def __repr__(self):
        return f'<Name: {self.name}>'