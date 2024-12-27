from sqlalchemy import Enum, Column, Integer, Text, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

LESSON_TYPES = ("text", "video", "quiz")

class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey('chapters.id'), nullable=False)
    type = Column(Enum(*LESSON_TYPES), nullable=False)
    name = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)

    # Many-to-one relationship with Chapter
    chapter = relationship('Chapter', back_populates='lessons')

    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'lesson'
    }

    def __repr__(self):
        return f'<Name: {self.name}>'
    
class TextLesson(Lesson):
    content = Column(Text) # can store markdown
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON_TYPES[0]
    }

class VideoLesson(Lesson):
    video_url = Column(String)
    # duration = Column(Integer)
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON_TYPES[1]
    }

class QuizLesson(Lesson):
    question_count = Column(Integer)
    
    __mapper_args__ = {
        'polymorphic_identity': LESSON_TYPES[2]
    }

# from sqlalchemy.orm import sessionmaker

# Session = sessionmaker(bind=engine)
# session = Session()

# # Create a course and chapter
# course = Course(title="Python Programming")
# chapter = Chapter(title="Basic Concepts", order=1)
# course.chapters.append(chapter)

# # Create different types of lessons
# video_lesson = VideoLesson(title="Introduction to Python", order=1, video_url="https://example.com/intro.mp4", duration=300)
# text_lesson = TextLesson(title="Variables and Data Types", order=2, content="Python has several built-in data types...")
# quiz_lesson = QuizLesson(title="Chapter 1 Quiz", order=3, question_count=5)

# # Add lessons to the chapter
# chapter.lessons.extend([video_lesson, text_lesson, quiz_lesson])

# # Create quiz questions and options
# question1 = Question(question_text="What is a correct syntax to output 'Hello World' in Python?", quiz=quiz_lesson)
# Option(option_text="print('Hello World')", is_correct=True, question=question1)
# Option(option_text="echo('Hello World');", is_correct=False, question=question1)

# session.add(course)
# session.commit()

# # Query example
# for course in session.query(Course).all():
#     print(f"Course: {course.title}")
#     for chapter in course.chapters:
#         print(f"  Chapter: {chapter.title}")
#         for lesson in chapter.lessons:
#             if isinstance(lesson, VideoLesson):
#                 print(f"    Video Lesson: {lesson.title}, Duration: {lesson.duration} seconds")
#             elif isinstance(lesson, TextLesson):
#                 print(f"    Text Lesson: {lesson.title}, Content length: {len(lesson.content)} characters")
#             elif isinstance(lesson, QuizLesson):
#                 print(f"    Quiz: {lesson.title}, Questions: {lesson.question_count}")

# session.close()

# from sqlalchemy import Column, Integer, BigInteger, String, Text, Float, DateTime, ForeignKey, Boolean, func
# from sqlalchemy.orm import relationship, declarative_base
# from sqlalchemy.ext.hybrid import hybrid_property

# Base = declarative_base()

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
#     user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
#     lesson_id = Column(BigInteger, ForeignKey('lessons.lesson_id'), nullable=False)
#     enrollment_id = Column(BigInteger, ForeignKey('course_enrollments.enrollment_id'), nullable=False)
#     completed_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationships
#     lesson = relationship("Lesson", back_populates="completions")
#     enrollment = relationship("CourseEnrollment", back_populates="lesson_completions")

#     # Ensure unique completion per user per lesson
#     __table_args__ = (
#         UniqueConstraint('user_id', 'lesson_id', name='unique_user_lesson_completion'),
#     )