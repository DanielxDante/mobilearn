from sqlalchemy import Enum, Column, Integer, Text, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from enums.lesson import LESSON
from models.lesson_completion import LessonCompletion

class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    lesson_type = Column(Enum(LESSON), nullable=False)
    order = Column(Integer, nullable=False)
    created = Column(DateTime, default=func.now(), nullable=False)
    updated = Column(DateTime, default=func.now(), nullable=False)

    # Many-to-many relationship with Chapter
    chapters = relationship('Chapter', secondary="chapter_lessons", back_populates='lessons')

    # Many-to-many relationship with Enrollment
    enrollments = relationship('Enrollment', secondary="lesson_completions", back_populates='completed_lessons')

    __mapper_args__ = {
        'polymorphic_identity': 'lesson',
        'polymorphic_on': 'lesson_type',
    }

    @staticmethod
    def get_lessons(session):
        return session.query(Lesson).all()
    
    @staticmethod
    def get_lesson_by_id(session, id):
        return session.query(Lesson).filter_by(id=id).first()
    
    @staticmethod
    def change_name(session, id, name):
        lesson = Lesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.name = name
        session.flush()

        return lesson
    
    @staticmethod
    def change_order(session, id, new_order):
        lesson = Lesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.order = new_order
        session.flush()

        return lesson

    def __repr__(self):
        return f'<Name: {self.name}>'
    
class TextLesson(Lesson):
    __tablename__ = 'text_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    content = Column(Text, nullable=False) # store rich text content as JSON
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON.TEXT
    }

    @staticmethod
    def change_content(session, id, content):
        lesson = TextLesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.content = content
        session.flush()

        return lesson

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'lesson_type': self.lesson_type,
            'order': self.order,
            'content': self.content
        }

class VideoLesson(Lesson):
    __tablename__ = 'video_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    video_url = Column(String, nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON.VIDEO
    }

    @staticmethod
    def change_video_url(session, id, video_url):
        lesson = VideoLesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.video_url = video_url
        session.flush()

        return lesson

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'lesson_type': self.lesson_type,
            'order': self.order,
            'video_url': self.video_url
        }

class HomeworkLesson(Lesson):
    __tablename__ = 'homework_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    homework_file_url = Column(String, nullable=False)

    # Many-to-many relationship with Enrollment
    enrollments = relationship('Enrollment', secondary="homework_submissions", back_populates='homework_submissions')
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON.HOMEWORK
    }

    @staticmethod
    def change_pdf_url(session, id, pdf_url):
        lesson = HomeworkLesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.pdf_url = pdf_url
        session.flush()

        return lesson

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'lesson_type': self.lesson_type,
            'order': self.order,
            'question_count': self.question_count
        }