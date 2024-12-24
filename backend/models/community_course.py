from sqlalchemy import Column, Integer, ForeignKey, DateTime, func

from database import Base

class CommunityCourse(Base):
    # Association table between Community and Course
    __tablename__ = 'community_courses'

    community_id = Column(Integer, ForeignKey('communities.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    added = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<Community: {self.community_id}, Course: {self.course_id}>'