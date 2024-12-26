from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import Base
from enums.gender import GENDER
from enums.status import STATUS
from models.offer import Offer
from models.community import Community

class Instructor(Base):
    __tablename__ = 'instructors'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False) # full name
    gender = Column(Enum(GENDER, name="gender_enum"), nullable=False)
    profile_picture_url = Column(String, nullable=True)
    phone_number = Column(String, nullable=False)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    stripe_account_id = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), nullable=False, default=func.now())
    updated = Column(DateTime(timezone=True), nullable=False, default=func.now())
    latest_login = Column(DateTime(timezone=True), nullable=False, default=func.now())
    status = Column(Enum(STATUS, name="status_enum"), nullable=False, default=STATUS.NOT_APPROVED)

    # Many-to-many relationship with Course
    courses = relationship("Course", secondary="offers", back_populates="instructors")

    # Many-to-many relationship with Community
    communities = relationship("Community", secondary="community_instructors", back_populates="instructors")

    @hybrid_property
    def password(self):
        raise AttributeError("Password is not a readable")

    @password.setter
    def password(self, password_plain):
        """ 
        Set password hash using Bcrypt
        Note Bcrypt().generate_password_hash.decode('utf-8') returns 72 character string
        """
        self.password_hash = Bcrypt().generate_password_hash(password_plain).decode('utf-8')

    @staticmethod
    def get_instructors(session):
        return (
            session.query(Instructor)
            .filter(Instructor.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .all()
        )
    
    @staticmethod
    def get_instructor_by_id(session, id):
        return (
            session.query(Instructor)
            .filter_by(id=id)
            .filter(Instructor.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .first()
        )

    @staticmethod
    def get_instructor_by_email(session, email):
        return (
            session.query(Instructor)
            .filter_by(email=email)
            .filter(Instructor.status.in_([STATUS.ACTIVE, STATUS.NOT_APPROVED]))
            .first()
        )
    
    @staticmethod
    def admin_get_instructor_by_email(session, email):
        return session.query(Instructor).filter_by(email=email).first()

    @staticmethod
    def add_instructor(
        session,
        name,
        password,
        email,
        phone_number,
        company,
        position,
        gender=GENDER.MALE,
        status=STATUS.NOT_APPROVED
    ):
        if Instructor.admin_get_instructor_by_email(session, email):
            raise ValueError("The email is already in use.")
        
        # soft coupling with Community
        if not Community.get_community_by_name(session, company):
            raise ValueError("The community is not found.")

        instructor = Instructor(
            email=email,
            name=name,
            phone_number=phone_number,
            company=company,
            position=position,
            gender=gender,
            status=status
        )
        instructor.password = password # separate from __init__ to use password.setter
        session.add(instructor)
        session.flush()

        return instructor

    @staticmethod
    def change_name(session, email, new_name):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            instructor.name = new_name
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def change_gender(session, email, new_gender):
        if new_gender not in GENDER.values():
            raise ValueError("Invalid gender value")
        
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            instructor.gender = new_gender
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def change_profile_picture_url(session, email, new_profile_picture_url):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            instructor.profile_picture_url = new_profile_picture_url
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def change_phone_number(session, email, new_phone_number):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            instructor.phone_number = new_phone_number
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def change_company(session, email, new_company):
        """ 
        Change the company of the instructor.
        Can deattach instructor from previous company.
        Initiate the approval process with new company.
        """
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            old_company = instructor.company


            instructor.company = new_company
            instructor.updated = func.now()
            instructor.status = STATUS.NOT_APPROVED
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")

    @staticmethod
    def change_position(session, email, new_position):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            instructor.position = new_position
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")

    @staticmethod
    def change_email(session, old_email, new_email):
        if Instructor.get_instructor_by_email(session, new_email):
            raise ValueError("The new email is already in use.")
        
        instructor = Instructor.get_instructor_by_email(session, old_email)
        if instructor:
            instructor.email = new_email
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the old email does not exist.")

    @staticmethod
    def change_password(session, email, old_password, new_password):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            if Bcrypt().check_password_hash(instructor.password_hash, old_password):
                instructor.password = new_password
                instructor.updated = func.now()
                session.flush()
            else:
                raise ValueError("The old password is incorrect.")
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def change_status(session, email, new_status):
        if new_status not in STATUS.values():
            raise ValueError("Invalid status value")
        
        instructor = Instructor.admin_get_instructor_by_email(session, email)
        if instructor:
            instructor.status = new_status
            instructor.updated = func.now()
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")
    
    @staticmethod
    def delete_instructor(session, email):
        instructor = Instructor.get_instructor_by_email(session, email)
        if instructor:
            session.delete(instructor)
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")

    def __repr__(self):
        return f'<Instructor {self.email}>'