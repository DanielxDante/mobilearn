from sqlalchemy import Enum, Column, Integer, Text, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from enums.lesson import LESSON
from models.user import User
from models.chapter import Chapter

class LessonBuilder:
    """ Unified builder for creating Lesson instances with factory method """

    def __init__(self, lesson_type):
        self._lesson = {
            'name': None,
            'lesson_type': lesson_type,
            'created': func.now(),
            'updated': func.now()
        }
        self._specific_attrs = {}
    
    @classmethod
    def create_text(cls) -> 'LessonBuilder':
        """ Factory method for text lesson builder """
        builder = cls(LESSON.TEXT)
        builder._specific_attrs = {
            'content': '{}'
        }
        return builder
    
    @classmethod
    def create_video(cls) -> 'LessonBuilder':
        """ Factory method for video lesson builder """
        builder = cls(LESSON.VIDEO)
        builder._specific_attrs = {
            'video_url': ""
        }
        return builder
    
    @classmethod
    def create_homework(cls) -> 'LessonBuilder':
        """ Factory method for homework lesson builder """
        builder = cls(LESSON.HOMEWORK)
        builder._specific_attrs = {
            'homework_url': ""
        }
        return builder
    
    def name(self, name):
        self._lesson['name'] = name
        return self
    
    # TextLesson specific attribute
    def content(self, content):
        if self._lesson['lesson_type'] != LESSON.TEXT:
            raise ValueError("Content is only available for TextLesson")
        self._specific_attrs['content'] = content
        return self
    
    # VideoLesson specific attribute
    def video_url(self, video_url):
        if self._lesson['lesson_type'] != LESSON.VIDEO:
            raise ValueError("Video URL is only available for VideoLesson")
        self._specific_attrs['video_url'] = video_url
        return self
    
    # HomeworkLesson specific attribute
    def homework_url(self, homework_url):
        if self._lesson['lesson_type'] != LESSON.HOMEWORK:
            raise ValueError("Homework URL is only available for HomeworkLesson")
        self._specific_attrs['homework_url'] = homework_url
        return self
    
    def build(self):
        """ Build the appropriate lesson instance based on lesson type """
        if not all([
            self._lesson['name'],
        ]):
            raise ValueError("Missing required fields")
        
        all_attrs = {**self._lesson, **self._specific_attrs}

        if self._lesson['lesson_type'] == LESSON.TEXT:
            lesson = TextLesson(**all_attrs)
        elif self._lesson['lesson_type'] == LESSON.VIDEO:
            lesson = VideoLesson(**all_attrs)
        elif self._lesson['lesson_type'] == LESSON.HOMEWORK:
            lesson = HomeworkLesson(**all_attrs)
        else:
            raise ValueError("Invalid lesson type")
        
        return lesson

class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    lesson_type = Column(Enum(LESSON), nullable=False)
    created = Column(DateTime, default=func.now(), nullable=False)
    updated = Column(DateTime, default=func.now(), nullable=False)

    # Many-to-many relationship with Chapter
    chapters = relationship('Chapter', secondary="chapter_lessons", back_populates='lessons')

    # Many-to-many relationship with User
    users = relationship('User', secondary="lesson_completions", back_populates='lesson_completions')

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
    def add_lesson(
        session,
        name,
        lesson_type,
        **kwargs
    ):
        try:
            builder = {
                LESSON.TEXT: LessonBuilder.create_text,
                LESSON.VIDEO: LessonBuilder.create_video,
                LESSON.HOMEWORK: LessonBuilder.create_homework
            }.get(lesson_type)()

            builder.name(name)

            if lesson_type == LESSON.TEXT:
                if 'content' in kwargs:
                    builder.content(kwargs['content'])
            elif lesson_type == LESSON.VIDEO:
                if 'video_url' in kwargs:
                    builder.video_url(kwargs['video_url'])
            elif lesson_type == LESSON.HOMEWORK:
                if 'homework_url' in kwargs:
                    builder.homework_url(kwargs['homework_url'])

            lesson = builder.build()

            session.add(lesson)
            session.flush()

            return lesson
        except Exception as e:
            raise ValueError(f"Failed to add lesson: {e}")
    
    @staticmethod
    def change_name(session, id, name):
        lesson = Lesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        lesson.name = name
        session.flush()

        return lesson
    
    @staticmethod
    def delete_lesson(session, id):
        lesson = Lesson.get_lesson_by_id(session, id)
        if not lesson:
            raise ValueError("Lesson not found")
        
        session.delete(lesson)
        session.flush()

        return lesson

    def __repr__(self):
        return f'<Name: {self.name}>'
    
class TextLesson(Lesson):
    __tablename__ = 'text_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    content = Column(Text, nullable=False, default="{}") # store rich text content as JSON
    
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
            'lesson_id': self.id,
            'lesson_name': self.name,
            'lesson_type': self.lesson_type,
            'content': self.content
        }

class VideoLesson(Lesson):
    __tablename__ = 'video_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    video_url = Column(String, nullable=False, default="")
    
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
            'lesson_id': self.id,
            'lesson_name': self.name,
            'lesson_type': self.lesson_type,
            'video_url': self.video_url
        }

class HomeworkLesson(Lesson):
    __tablename__ = 'homework_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    homework_url = Column(String, nullable=False, default="")

    # Many-to-many relationship with User
    submissions = relationship('User', secondary="homework_submissions", back_populates='homework_submissions')
    
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
            'lesson_id': self.id,
            'lesson_name': self.name,
            'lesson_type': self.lesson_type,
            'homework_url': self.homework_url
        }
