from sqlalchemy import (
    Enum,
    Column,
    Integer,
    Numeric,
    String,
    DateTime,
    ForeignKey,
    event,
    func,
    select
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from database import Base
from enums.status import STATUS
from enums.difficulty import DIFFICULTY
from enums.course import COURSE
from models.community import Community
from models.review import Review

class CourseBuilder:
    """ Unified builder for creating Course instances with factory method """
    
    def __init__(self, course_type: COURSE):
        self._course = {
            'name': None,
            'description': None,
            'course_type': course_type,
            'duration': None,
            'rating': 0.00,
            'image_url': None,
            'currency': 'USD',
            'price': None,
            'difficulty': None,
            'skills': None,
            'created': func.now(),
            'updated': func.now(),
            'status': STATUS.ACTIVE
        }
        self._specific_attrs = {}

    @classmethod
    def create_academic(cls) -> 'CourseBuilder':
        """ Factory method for academic course builder """
        builder = cls(COURSE.ACADEMIC)
        builder._specific_attrs = {
            'school_name': None,
            'program_type': None,
            'field': None,
            'major': None
        }
        return builder

    @classmethod
    def create_professional(cls) -> 'CourseBuilder':
        """ Factory method for professional course builder """
        builder = cls(COURSE.PROFESSIONAL)
        builder._specific_attrs = {
            'department': None,
        }
        return builder

    @classmethod
    def create_specialization(cls) -> 'CourseBuilder':
        """ Factory method for specialization course builder """
        builder = cls(COURSE.SPECIALIZATION)
        builder._specific_attrs = {
            'subject': None
        }
        return builder
    
    @classmethod
    def create_project(cls) -> 'CourseBuilder':
        """ Factory method for project course builder """
        builder = cls(COURSE.PROJECT)
        builder._specific_attrs = {
            'platform': None
        }
        return builder

    def name(self, name: str) -> 'CourseBuilder':
        self._course['name'] = name
        return self

    def description(self, description: str) -> 'CourseBuilder':
        self._course['description'] = description
        return self

    def duration(self, duration: float) -> 'CourseBuilder':
        if duration < 0:
            raise ValueError("Duration cannot be negative")
        self._course['duration'] = float(str(duration))
        return self

    def image_url(self, url: str) -> 'CourseBuilder':
        self._course['image_url'] = url
        return self

    def price(self, price: float, currency: str = 'USD') -> 'CourseBuilder':
        if price < 0:
            raise ValueError("Price cannot be negative")
        self._course['price'] = float(str(price))
        self._course['currency'] = currency
        return self

    def difficulty(self, difficulty: DIFFICULTY) -> 'CourseBuilder':
        self._course['difficulty'] = difficulty
        return self

    def skills(self, skills: list) -> 'CourseBuilder':
        self._course['skills'] = ', '.join(skills)
        return self

    def status(self, status: STATUS) -> 'CourseBuilder':
        self._course['status'] = status
        return self

    # AcademicCourse methods
    def school_name(self, name: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.ACADEMIC:
            raise ValueError("school_name is only valid for academic courses")
        self._specific_attrs['school_name'] = name
        return self

    def program_type(self, program_type: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.ACADEMIC:
            raise ValueError("program_type is only valid for academic courses")
        self._specific_attrs['program_type'] = program_type
        return self

    def field(self, field: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.ACADEMIC:
            raise ValueError("field is only valid for academic courses")
        self._specific_attrs['field'] = field
        return self

    def major(self, major: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.ACADEMIC:
            raise ValueError("major is only valid for academic courses")
        self._specific_attrs['major'] = major
        return self

    # ProfessionalCourse methods
    def department(self, department: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.PROFESSIONAL:
            raise ValueError("department is only valid for professional courses")
        self._specific_attrs['department'] = department
        return self
    
    # SpecializationCourse methods
    def subject(self, subject: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.SPECIALIZATION:
            raise ValueError("subject is only valid for specialization courses")
        self._specific_attrs['subject'] = subject
        return self

    # ProjectCourse methods
    def platform(self, platform: str) -> 'CourseBuilder':
        if self._course['course_type'] != COURSE.PROJECT:
            raise ValueError("platform is only valid for project courses")
        self._specific_attrs['platform'] = platform
        return self

    def build(self):
        """ Build the appropriate course type based on course_type """
        if not all([
            self._course['name'],
            self._course['description'],
            self._course['difficulty']
        ]):
            raise ValueError("Missing required fields")

        all_attrs = {**self._course, **self._specific_attrs}
        
        if self._course['course_type'] == COURSE.ACADEMIC:
            return AcademicCourse(**all_attrs)
        elif self._course['course_type'] == COURSE.PROFESSIONAL:
            return ProfessionalCourse(**all_attrs)
        elif self._course['course_type'] == COURSE.SPECIALIZATION:
            return SpecializationCourse(**all_attrs)
        elif self._course['course_type'] == COURSE.PROJECT:
            return ProjectCourse(**all_attrs)

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    community_id = Column(Integer, ForeignKey('communities.id'), nullable=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    course_type = Column(Enum(COURSE), nullable=False)

    # common fields
    duration = Column(Numeric(5, 1), nullable=True) # weeks
    rating = Column(Numeric(4, 2), nullable=True, default=0.00) # 0 means unrated, users can rate from 0.00 to 5.00
    image_url = Column(String, nullable=True)
    currency = Column(String, nullable=True, default='USD') # ISO 4217, default in USD
    price = Column(Numeric(10, 2), nullable=True, default=0.00) # 0 means free
    difficulty = Column(Enum(DIFFICULTY), nullable=True)
    skills = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    status = Column(Enum(STATUS), nullable=False, default=STATUS.ACTIVE)

    __mapper_args__ = {
        'polymorphic_identity': 'course',
        'polymorphic_on': 'course_type'
    }

    # Many-to-many relationship with Instructor
    instructors = relationship("Instructor", secondary="offers", back_populates="courses")

    # Many-to-one relationship with Community
    communities = relationship("Community", back_populates="courses")

    # Many-to-many relationship with User
    user_reviews = relationship("User", secondary="reviews", back_populates="course_reviews")
    user_enrollments = relationship("User", secondary="enrollments", back_populates="course_enrollments")

    # Many-to-many relationship with Chapter
    # chapter_associations = relationship(
    #     "CourseChapter",
    #     back_populates="course",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True
    # )
    # chapters = association_proxy('chapter_associations', 'chapter')

    @staticmethod
    def get_courses(session):
        return (
            session.query(Course)
            .filter(Course.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .all()
        )
    
    @staticmethod
    def get_course_by_id(session, id):
        return (
            session.query(Course)
            .filter_by(id=id)
            .filter(Course.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .first()
        )
    
    @staticmethod
    def get_course_by_name(session, name):
        return (
            session.query(Course)
            .filter_by(name=name)
            .filter(Course.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .first()
        )
    
    @staticmethod
    def admin_get_course_by_name(session, name):
        return session.query(Course).filter_by(name=name).first()

    @staticmethod
    def add_course(
        session,
        community_id,
        name,
        description,
        course_type,
        **kwargs
    ):
        try:
            builder = {
                COURSE.ACADEMIC: CourseBuilder.create_academic,
                COURSE.PROFESSIONAL: CourseBuilder.create_professional,
                COURSE.SPECIALIZATION: CourseBuilder.create_specialization,
                COURSE.PROJECT: CourseBuilder.create_project
            }.get(course_type)()
            
            builder.name(name).description(description)
            
            if 'duration' in kwargs:
                builder.duration(kwargs['duration'])
            if 'image_url' in kwargs:
                builder.image_url(kwargs['image_url'])
            if 'price' in kwargs:
                builder.price(kwargs['price'], kwargs.get('currency', 'USD'))
            if 'difficulty' in kwargs:
                builder.difficulty(kwargs['difficulty'])
            if 'skills' in kwargs: # delimited by commas
                builder.skills(kwargs['skills'])
            if 'status' in kwargs:
                builder.status(kwargs['status'])
                
            if course_type == COURSE.ACADEMIC:
                if 'school_name' in kwargs:
                    builder.school_name(kwargs['school_name'])
                if 'program_type' in kwargs:
                    builder.program_type(kwargs['program_type'])
                if 'field' in kwargs:
                    builder.field(kwargs['field'])
                if 'major' in kwargs:
                    builder.major(kwargs['major'])
            elif course_type == COURSE.PROFESSIONAL: 
                if 'department' in kwargs:
                    builder.department(kwargs['department'])
            elif course_type == COURSE.SPECIALIZATION:
                if 'subject' in kwargs:
                    builder.subject(kwargs['subject'])
            elif course_type == COURSE.PROJECT:
                if 'platform' in kwargs:
                    builder.platform(kwargs['platform'])
            
            course = builder.build()

            community = Community.get_community_by_id(session, community_id)
            community.courses.append(course)
            
            session.flush()
            
            return course
            
        except Exception as e:
            raise ValueError(f"Failed to create course: {str(e)}")
    
    @staticmethod
    def change_name(session, id, new_name):
        course = Course.get_course_by_id(session, id)
        if course:
            course.name = new_name
            course.updated = func.now()
            session.flush()
        else:
            raise ValueError("Course not found")
    
    @staticmethod
    def change_description(session, id, new_description):
        course = Course.get_course_by_id(session, id)
        if course:
            course.description = new_description
            course.updated = func.now()
            session.flush()
        else:
            raise ValueError("Course not found")
    
    def __repr__(self):
        return f'<Name: {self.name}'
    
@event.listens_for(Review, 'after_insert')
@event.listens_for(Review, 'after_update')
@event.listens_for(Review, 'after_delete')
def update_course_rating(mapper, connection, target):
    course_id = target.course_id
    stmt = (
        select(func.avg(Review.rating))
        .where(Review.course_id == course_id)
    )
    avg_rating = connection.execute(stmt).scalar()
    if avg_rating:
        avg_rating = round(avg_rating, 2)
    
    connection.execute(
        Course.__table__.update()
        .where(Course.id == course_id)
        .values(rating=avg_rating)
    )
    

class AcademicCourse(Course):
    # for academic progressions with a broader and theoretical focus
    __tablename__ = 'academic_courses'

    id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    school_name = Column(String, nullable=True) # e.g., College of Computer and Data Science
    program_type = Column(String, nullable=True) # e.g., Bachelor
    field = Column(String, nullable=True) # e.g., Computer Science
    major = Column(String, nullable=True) # e.g., Artificial Intelligence

    __mapper_args__ = {
        'polymorphic_identity': COURSE.ACADEMIC
    }

    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'name': self.name,
            'description': self.description,
            'course_type': self.course_type,
            'duration': float(self.duration),
            'rating': float(self.rating),
            'image_url': self.image_url,
            'currency': self.currency,
            'price': float(self.price),
            'difficulty': self.difficulty,
            'skills': self.skills.split(', ') if self.skills else [],
            'school_name': self.school_name,
            'program_type': self.program_type,
            'field': self.field,
            'major': self.major,
            'created': self.created.isoformat() if self.created else None,
            'updated': self.updated.isoformat() if self.updated else None,
            'status': self.status
        }

class ProfessionalCourse(Course):
    # earn career credentials from industry leaders that demostrate expertise
    __tablename__ = 'professional_courses'

    id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    department = Column(String, nullable=True) # e.g., Human Resources
    skill = Column(String, nullable=True) # e.g., Leadership

    __mapper_args__ = {
        'polymorphic_identity': COURSE.PROFESSIONAL
    }

    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'name': self.name,
            'description': self.description,
            'course_type': self.course_type,
            'duration': float(self.duration),
            'rating': float(self.rating),
            'image_url': self.image_url,
            'currency': self.currency,
            'price': float(self.price),
            'difficulty': self.difficulty,
            'skills': self.skills.split(', ') if self.skills else [],
            'department': self.department,
            'created': self.created.isoformat() if self.created else None,
            'updated': self.updated.isoformat() if self.updated else None,
            'status': self.status
        }

class SpecializationCourse(Course):
    # get in-depth knowledge of a subject
    __tablename__ = 'specialization_courses'

    id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    subject = Column(String, nullable=True) # e.g., Social Sciences

    __mapper_args__ = {
        'polymorphic_identity': COURSE.SPECIALIZATION
    }

    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'name': self.name,
            'description': self.description,
            'course_type': self.course_type,
            'duration': float(self.duration),
            'rating': float(self.rating),
            'image_url': self.image_url,
            'currency': self.currency,
            'price': float(self.price),
            'difficulty': self.difficulty,
            'skills': self.skills.split(', ') if self.skills else [],
            'subject': self.subject,
            'created': self.created.isoformat() if self.created else None,
            'updated': self.updated.isoformat() if self.updated else None,
            'status': self.status
        }

class ProjectCourse(Course):
    # learn a new tool or skill in an interactive, hands-on environment
    __tablename__ = 'project_courses'

    id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    platform = Column(String, nullable=True) # e.g., Google Cloud

    __mapper_args__ = {
        'polymorphic_identity': COURSE.PROJECT
    }

    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'name': self.name,
            'description': self.description,
            'course_type': self.course_type,
            'duration': float(self.duration),
            'rating': float(self.rating),
            'image_url': self.image_url,
            'currency': self.currency,
            'price': float(self.price),
            'difficulty': self.difficulty,
            'skills': self.skills.split(', ') if self.skills else [],
            'platform': self.platform,
            'created': self.created.isoformat() if self.created else None,
            'updated': self.updated.isoformat() if self.updated else None,
            'status': self.status
        }