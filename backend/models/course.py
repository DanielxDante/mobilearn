from sqlalchemy import Enum, Column, Integer, Numeric, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db
from . import STATUSES

DIFFICULTY = ("beginner", "intermediate", "advanced")

class Course(db.Model):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    rating = Column(Numeric(2), nullable=True, default=0.00)
    image_url = Column(String, nullable=True)
    # currency = Column(String, nullable=True, default='USD')
    price = Column(Numeric(2), nullable=True, default=0.00)
    difficulty = Column(Enum(*DIFFICULTY), nullable=False, default='beginner')
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    status = Column(Enum(*STATUSES), nullable=False, default='active')

    # Many-to-many relationship with Skill
    skill_associations = relationship("CourseSkill", back_populates="course")
    skills = association_proxy('skill_associations', 'skill')
    
    # Many-to-many relationship with Program
    program_associations = relationship("ProgramCourse", back_populates="course")
    programs = association_proxy('program_associations', 'program')

    # Many-to-many relationship with Chapter
    chapter_associations = relationship(
        "CourseChapter",
        back_populates="course",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    chapters = association_proxy('chapter_associations', 'chapter')

    @staticmethod
    def add_course():
        pass

    @staticmethod
    def get_courses():
        return Course.query.all()
    
    @staticmethod
    def get_course_by_id(id):
        return Course.query.get(id)
    
    @staticmethod
    def get_course_by_name(name):
        return Course.query.filter_by(name=name).first()
    
    @staticmethod
    def get_courses_by_school(school):
        return Course.query.filter_by(school=school).all()
    
    def __repr__(self):
        return f'<Name: {self.name}'