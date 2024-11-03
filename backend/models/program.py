from sqlalchemy import Enum, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db
from . import STATUSES

# cet is similar to a series of courses that gives a certificate
PROGRAM_TYPES = ("bachelor", "master", "phd", "cet")

class Program(db.Model):
    __tablename__ = 'programs'

    id = Column(Integer, primary_key=True)
    school_id = Column(Integer, ForeignKey('schools.id'), nullable=False)
    program_type = Column(Enum(*PROGRAM_TYPES), nullable=False, default='bachelor')
    field = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    # One-to-many relationship with School
    school = relationship('School', back_populates='programs')

    # Many-to-many relationship with Course
    course_associations = relationship(
        "ProgramCourse",
        back_populates="program",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    courses = association_proxy('course_associations', 'course')

    def __repr__(self):
        return f'<Field: {self.field}, Specialization: {self.specialization}, School: {self.school_id}>'