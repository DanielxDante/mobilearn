# TO BE DEPRECATED

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func

from database import Base

class Offer(Base):
    # Association table between Instructor and Course
    __tablename__ = 'offers'

    instructor_id = Column(Integer, ForeignKey('instructors.id', ondelete='CASCADE'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)
    created = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<Instructor: {self.instructor_id}, Course: {self.course_id}>'