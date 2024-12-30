from sqlalchemy import Column, Integer, DateTime, ForeignKey, func

from database import Base

class CourseChapter(Base):
    # Association table between Course and Chapter
    __tablename__ = 'course_chapters'

    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)
    chapter_id = Column(Integer, ForeignKey('chapters.id', ondelete='CASCADE'), primary_key=True)
    attached = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(CourseChapter) Course: {self.course_id}, Chapter: {self.chapter_id}>'