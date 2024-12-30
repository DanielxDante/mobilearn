from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from database import Base

class Chapter(Base):
    __tablename__ = 'chapters'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False) # starts from 1
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    # Many-to-many relationship with Course
    courses = relationship("Course", secondary="course_chapters", back_populates="chapters")

    # One-to-many relationship with Lesson
    # lessons = relationship("Lesson", back_populates="chapter")

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