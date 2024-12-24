# TO BE DEPRECRATED - DO NOT USE

from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import Base
from . import GENDERS, STATUSES

MEMBERSHIPS = ("normal", "member", "core_member")

class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True) # consider using ULID if IDs are exposed on frontend
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False) # full name
    password_hash = Column(String, nullable=False)
    gender = Column(Enum(*GENDERS, name="gender_enum"), nullable=False)
    profile_picture_url = Column(String, nullable=True) # CDN link
    membership = Column(Enum(*MEMBERSHIPS, name="membership_enum"), nullable=False, default='normal')
    stripe_customer_id = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), nullable=False, default=func.now())
    updated = Column(DateTime(timezone=True), nullable=False, default=func.now())
    latest_login = Column(DateTime(timezone=True), nullable=False, default=func.now())
    status = Column(Enum(*STATUSES, name="status_enum"), nullable=False, default='active')

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
    def get_users(session):
        return session.query(User).all()
    
    @staticmethod
    def get_user_by_id(session, id):
        return session.query(User).filter_by(id=id).first()

    @staticmethod
    def get_user_by_email(session, email):
        return session.query(User).filter_by(email=email).first()
    
    @staticmethod
    def get_users_by_membership(session, membership):
        return session.query(User).filter_by(membership=membership).all()

    @staticmethod
    def add_user(session, password, email, name, gender):
        user = User(
            email=email,
            name=name,
            gender=gender
        )
        user.password = password # separate from __init__ to use password.setter
        session.add(user)
        session.flush()

    @staticmethod
    def change_email(session, old_email, new_email):
        if session.query(User).filter_by(email=new_email).first():
            raise ValueError("The new email is already in use.")
        
        user = session.query(User).filter_by(email=old_email).first()
        if user:
            user.email = new_email
            session.flush()
        else:
            raise ValueError("User with the old email does not exist.")
    
    @staticmethod
    def change_name(session, email, new_name):
        user = session.query(User).filter_by(email=email).first()
        if user:
            user.name = new_name
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")

    @staticmethod
    def change_password(session, email, old_password, new_password):
        user = session.query(User).filter_by(email=email).first()
        if user:
            if Bcrypt().check_password_hash(user.password_hash, old_password):
                user.password = new_password
                session.flush()
            else:
                raise ValueError("The old password is incorrect.")
        else:
            raise ValueError("User with the email does not exist.")
    

    def __repr__(self):
        return f'<User {self.email}>'