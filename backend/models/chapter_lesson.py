from sqlalchemy import Column, Integer, DateTime, ForeignKey, func

from database import Base

class ChapterLesson(Base):
    # Association table between Chapter and Lesson
    __tablename__ = 'chapter_lessons'

    chapter_id = Column(Integer, ForeignKey('chapters.id', ondelete='CASCADE'), primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete='CASCADE'), primary_key=True)
    order = Column(Integer, nullable=False) # starts from 1
    attached = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(ChapterLesson) Chapter: {self.chapter_id}, Lesson: {self.lesson_id}>'