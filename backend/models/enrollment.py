from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey, func

from database import Base

class Enrollment(Base):
    # Association table between User and Course
    __tablename__ = 'enrollments'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)
    # is_paid = Column(Boolean, nullable=False, default=False)
    enrolled = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    @staticmethod
    def add_enrollment(
        session,
        course_id,
        user_id
    ):
        enrollment = Enrollment(
            course_id=course_id,
            user_id=user_id
        )
        session.add(enrollment)
        return enrollment
    
    def __repr__(self):
        return f'<(Enrollment) Course: {self.course_id}, User: {self.user_id}>'