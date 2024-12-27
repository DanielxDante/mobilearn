from sqlalchemy import Column, Integer, Numeric, Text, DateTime, ForeignKey, func

from database import Base

class Review(Base):
    # Association table between User and Course
    __tablename__ = 'reviews'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)
    rating = Column(Numeric(precision=2, scale=1), nullable=False)
    review_text = Column(Text, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(Review) Course: {self.course_id}, User: {self.user_id}>'
