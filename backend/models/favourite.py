from sqlalchemy import Column, Integer, DateTime, ForeignKey, func

from database import Base

class Favourite(Base):
    # Association table between User and Course
    __tablename__ = 'favourites'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    def __repr__(self):
        return f'<(Favourite) Course: {self.course_id}, User: {self.user_id}>'
