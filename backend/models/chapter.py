from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

class Chapter(db.Model):
    __tablename__ = 'chapters'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)

    # Many-to-many relationship with Course
    course_associations = relationship("CourseChapter", back_populates="chapter")
    courses = association_proxy('course_associations', 'course')

    # One-to-many relationship with Lesson
    lessons = relationship("Lesson", back_populates="chapter")

    def __repr__(self):
        return f'<Name: {self.name}>'