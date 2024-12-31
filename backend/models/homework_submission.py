from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func

from database import Base

class HomeworkSubmission(Base):
    # Association table between HomeworkLesson and Enrollment
    __tablename__ = 'homework_submissions'

    enrollment_id = Column(Integer, ForeignKey('enrollments.id', ondelete='CASCADE'), primary_key=True)
    homework_lesson_id = Column(Integer, ForeignKey('homework_lessons.id', ondelete='CASCADE'), primary_key=True)
    homework_submission_file_url = Column(String, nullable=False)
    submitted = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(HomeworkSubmission) Homework: {self.homework_lesson_id}, Enrollment: {self.enrollment_id}>'