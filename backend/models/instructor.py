from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import Base
from . import GENDER, STATUS

class Instructor(Base):
    __tablename__ = 'instructors'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False) # full name
    password_hash = Column(String, nullable=False)
    gender = Column(Enum(*GENDER, name="gender_enum"), nullable=False)
    profile_picture_url = Column(String, nullable=True) # CDN link
    phone_number = Column(String, nullable=False)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    stripe_account_id = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), nullable=False, default=func.now())
    updated = Column(DateTime(timezone=True), nullable=False, default=func.now())
    status = Column(Enum(*STATUS, name="status_enum"), nullable=False, default=STATUS.NOT_APPROVED)

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
        return session.query(Instructor).all()
    
    @staticmethod
    def get_instructor_by_id(session, id):
        return session.query(Instructor).filter_by(id=id).first()

    @staticmethod
    def get_instructor_by_email(session, email):
        return session.query(Instructor).filter_by(email=email).first()
    
    @staticmethod
    def get_instructors_by_membership(session, membership):
        return session.query(Instructor).filter_by(membership=membership).all()

    @staticmethod
    def add_instructor(
        session, name, password, email, gender,
        phone_number, company, position
    ):
        instructor = Instructor(
            email=email,
            name=name,
            gender=gender,
            phone_number=phone_number,
            company=company,
            position=position
        )
        instructor.password = password # separate from __init__ to use password.setter
        session.add(instructor)
        session.flush()

    @staticmethod
    def change_email(session, old_email, new_email):
        if session.query(Instructor).filter_by(email=new_email).first():
            raise ValueError("The new email is already in use.")
        
        instructor = session.query(Instructor).filter_by(email=old_email).first()
        if instructor:
            instructor.email = new_email
            session.flush()
        else:
            raise ValueError("Instructor with the old email does not exist.")
    
    @staticmethod
    def change_name(session, email, new_name):
        instructor = session.query(Instructor).filter_by(email=email).first()
        if instructor:
            instructor.name = new_name
            session.flush()
        else:
            raise ValueError("Instructor with the email does not exist.")

    @staticmethod
    def change_password(session, email, old_password, new_password):
        instructor = session.query(Instructor).filter_by(email=email).first()
        if instructor:
            if Bcrypt().check_password_hash(instructor.password_hash, old_password):
                instructor.password = new_password
                session.flush()
            else:
                raise ValueError("The old password is incorrect.")
        else:
            raise ValueError("Instructor with the email does not exist.")
    

    def __repr__(self):
        return f'<Instructor {self.email}>'