from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class ProgramCourse(db.Model):
    __tablename__ = 'program_courses'

    program_id = Column(Integer, ForeignKey('programs.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    program = relationship("Program", back_populates="course_associations")
    course = relationship("Course", back_populates="program_associations")
    
    def __repr__(self):
        return f'<Program: {self.program_id}, Course: {self.course_id}>'