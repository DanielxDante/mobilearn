from sqlalchemy import Column, Integer, DateTime, ForeignKey, func

from database import Base

class LessonCompletion(Base):
    # Association table between Enrollment and Lesson
    __tablename__ = 'lesson_completions'

    enrollment_id = Column(Integer, ForeignKey('enrollments.id', ondelete='CASCADE'), primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete='CASCADE'), primary_key=True)
    completed = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(LessonCompletion) Lesson: {self.lesson_id}, Enrollment: {self.enrollment_id}>'