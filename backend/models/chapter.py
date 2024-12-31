from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from models.chapter_lesson import ChapterLesson

class Chapter(Base):
    __tablename__ = 'chapters'

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False) # starts from 1
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    # Many-to-one relationship with Course
    course = relationship("Course", back_populates="chapters")

    # Many-to-many relationship with Lesson
    lessons = relationship("Lesson", secondary="chapter_lessons", back_populates="chapters")

    @staticmethod
    def get_chapters(session):
        return session.query(Chapter).all()

    @staticmethod
    def get_chapter_by_id(session, id):
        return session.query(Chapter).filter_by(id=id).first()
    
    @staticmethod
    def change_title(session, id, title):
        chapter = Chapter.get_chapter_by_id(session, id)
        if not chapter:
            raise ValueError("Chapter not found")
        
        chapter.title = title
        session.flush()

        return chapter
    
    @staticmethod
    def change_order(session, id, new_order):
        chapter = Chapter.get_chapter_by_id(session, id)
        if not chapter:
            raise ValueError("Chapter not found")
        
        chapter.order = new_order
        session.flush()

        return chapter
    
    @staticmethod
    def delete_chapter(session, id):
        chapter = Chapter.get_chapter_by_id(session, id)
        if not chapter:
            raise ValueError("Chapter not found")
        
        session.delete(chapter)
        session.flush()

        return chapter

    def __repr__(self):
        return f'<Name: {self.name}>'