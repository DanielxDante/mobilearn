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