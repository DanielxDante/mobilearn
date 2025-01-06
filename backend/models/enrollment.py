from sqlalchemy import Column, Integer, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base
from models.lesson_completion import LessonCompletion
from models.homework_submission import HomeworkSubmission

class Enrollment(Base):
    # Association table between User and Course
    __tablename__ = 'enrollments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'))
    enrolled = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint('user_id', 'course_id', name='_user_course_uc'),)

    # Many-to-many relationship with Lesson
    completed_lessons = relationship('Lesson', secondary="lesson_completions", back_populates='enrollments')

    # Many-to-many relationship with HomeworkLesson
    homework_submissions = relationship('HomeworkLesson', secondary="homework_submissions", back_populates='enrollments')

    @staticmethod
    def get_enrollment_by_user_and_course(session, user_id, course_id):
        return (
            session.query(Enrollment)
            .filter(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id
            )
            .first()
        )

    def __repr__(self):
        return f'<(Enrollment) Course: {self.course_id}, User: {self.user_id}>'