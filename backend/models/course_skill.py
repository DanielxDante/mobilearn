from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

class CourseSkill(db.Model):
    __tablename__ = 'course_skills'

    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skills.id'), primary_key=True)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    course = relationship("Course", back_populates="skill_associations")
    skill = relationship("Skill", back_populates="course_associations")
    
    def __repr__(self):
        return f'<Course: {self.course_id}, Skill: {self.skill_id}>'