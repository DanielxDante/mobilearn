from sqlalchemy import Enum, Column, Integer, Text, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from enums.lesson import LESSON
from models.chapter import Chapter
from models.lesson_completion import LessonCompletion

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
            'id': self.id,
            'name': self.name,
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
            'id': self.id,
            'name': self.name,
            'lesson_type': self.lesson_type,
            'video_url': self.video_url
        }

class HomeworkLesson(Lesson):
    __tablename__ = 'homework_lessons'

    id = Column(Integer, ForeignKey('lessons.id'), primary_key=True)
    homework_url = Column(String, nullable=False, default="")

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
            'question_count': self.question_count
        }

# class Course(Base):
#     __tablename__ = 'courses'
    
#     course_id = Column(BigInteger, primary_key=True)
#     title = Column(String(255), nullable=False)
#     description = Column(Text)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     chapters = relationship("Chapter", back_populates="course", order_by="Chapter.order")
#     enrollments = relationship("CourseEnrollment", back_populates="course")

#     def get_completion_percentage(self, user_id):
#         """Calculate overall course completion percentage for a user"""
#         total_lessons = sum(chapter.total_lessons for chapter in self.chapters)
#         if total_lessons == 0:
#             return 0.0
            
#         completed_lessons = sum(
#             chapter.get_completed_lessons_count(user_id) 
#             for chapter in self.chapters
#         )
#         return (completed_lessons / total_lessons) * 100

# class Chapter(Base):
#     __tablename__ = 'chapters'
    
#     chapter_id = Column(BigInteger, primary_key=True)
#     course_id = Column(BigInteger, ForeignKey('courses.course_id'), nullable=False)
#     title = Column(String(255), nullable=False)
#     description = Column(Text)
#     order = Column(Integer, nullable=False)  # For chapter sequence
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     course = relationship("Course", back_populates="chapters")
#     lessons = relationship("Lesson", back_populates="chapter", order_by="Lesson.order")

#     @property
#     def total_lessons(self):
#         return len(self.lessons)

#     def get_completed_lessons_count(self, user_id):
#         """Count completed lessons in this chapter for a user"""
#         return sum(
#             1 for lesson in self.lessons 
#             if lesson.is_completed(user_id)
#         )

#     def get_completion_percentage(self, user_id):
#         """Calculate chapter completion percentage for a user"""
#         if not self.lessons:
#             return 0.0
#         return (self.get_completed_lessons_count(user_id) / self.total_lessons) * 100

# class Lesson(Base):
#     __tablename__ = 'lessons'
    
#     lesson_id = Column(BigInteger, primary_key=True)
#     chapter_id = Column(BigInteger, ForeignKey('chapters.chapter_id'), nullable=False)
#     title = Column(String(255), nullable=False)
#     content = Column(Text)
#     order = Column(Integer, nullable=False)  # For lesson sequence
#     duration_minutes = Column(Integer)  # Optional: track estimated duration
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     chapter = relationship("Chapter", back_populates="lessons")
#     completions = relationship("LessonCompletion", back_populates="lesson")

#     def is_completed(self, user_id):
#         """Check if a specific user has completed this lesson"""
#         return any(
#             completion.user_id == user_id 
#             for completion in self.completions
#         )

# class CourseEnrollment(Base):
#     __tablename__ = 'course_enrollments'
    
#     enrollment_id = Column(BigInteger, primary_key=True)
#     user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
#     course_id = Column(BigInteger, ForeignKey('courses.course_id'), nullable=False)
#     enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
#     last_accessed_at = Column(DateTime(timezone=True))

#     # Relationships
#     course = relationship("Course", back_populates="enrollments")
#     lesson_completions = relationship("LessonCompletion", back_populates="enrollment")

#     @hybrid_property
#     def completion_percentage(self):
#         """Get real-time course completion percentage"""
#         return self.course.get_completion_percentage(self.user_id)

# class LessonCompletion(Base):
#     __tablename__ = 'lesson_completions'
    
#     completion_id = Column(BigInteger, primary_key=True)
#     lesson_id = Column(BigInteger, ForeignKey('lessons.lesson_id'), nullable=False)
#     enrollment_id = Column(BigInteger, ForeignKey('course_enrollments.enrollment_id'), nullable=False)
#     completed_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     lesson = relationship("Lesson", back_populates="completions")
#     enrollment = relationship("CourseEnrollment", back_populates="lesson_completions")

#     # Ensure unique completion per lesson per enrollment
#     __table_args__ = (
#         UniqueConstraint('enrollment_id', 'lesson_id', name='unique_enrollment_lesson_completion'),
#     )