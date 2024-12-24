from sqlalchemy import Column, Integer, ForeignKey, DateTime, func

from database import Base

class CommunityInstructor(Base):
    # Association table between Community and Instructor
    __tablename__ = 'community_instructors'

    community_id = Column(Integer, ForeignKey('communities.id'), primary_key=True)
    instructor_id = Column(Integer, ForeignKey('instructors.id'), primary_key=True)
    joined = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f'<Community: {self.community_id}>, Instructor: {self.instructor_id}'