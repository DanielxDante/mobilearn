from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class CourseChapter(db.Model):
    __tablename__ = 'course_chapters'

    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    chapter_id = Column(Integer, ForeignKey('chapters.id'), primary_key=True)
    created = Column(DateTime(timezone=True), server_default=db.func.now(tz="UTC"), nullable=False)
    
    course = relationship("Course", back_populates="chapter_associations")
    chapter = relationship("chapter", back_populates="course_associations")
    
    def __repr__(self):
        return f'<Course: {self.course_id}, Chapter: {self.chapter_id}>'