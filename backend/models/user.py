from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import Base
from enums.gender import GENDER
from enums.status import STATUS
from enums.membership import MEMBERSHIP
from models.user_channel import UserChannel
from models.review import Review
from models.enrollment import Enrollment
from models.favourite import Favourite

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False) # full name
    gender = Column(Enum(GENDER, name="gender_enum"), nullable=False)
    profile_picture_url = Column(String, nullable=True)
    membership = Column(Enum(MEMBERSHIP, name="membership_enum"), nullable=False, default=MEMBERSHIP.NORMAL)
    stripe_customer_id = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), nullable=False, default=func.now())
    updated = Column(DateTime(timezone=True), nullable=False, default=func.now())
    latest_login = Column(DateTime(timezone=True), nullable=False, default=func.now())
    status = Column(Enum(STATUS, name="status_enum"), nullable=False, default=STATUS.ACTIVE)

    # Many-to-many relationship with Chat
    chats = relationship("Chat", secondary="user_chats", back_populates="users")

    # One-to-many relationship with Message
    sent_messages = relationship("Message", back_populates="sender", cascade="all, delete-orphan")

    # Many-to=many relationship with Channel
    channels = relationship("Channel", secondary="user_channels", back_populates="users")

    # Many-to-many relationship with Course
    course_reviews = relationship("Course", secondary="reviews", back_populates="user_reviews")
    course_enrollments = relationship("Course", secondary="enrollments", back_populates="user_enrollments")
    course_favourites = relationship("Course", secondary="favourites", back_populates="user_favourites")

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
        return session.query(User).filter_by(status=STATUS.ACTIVE).all()
    
    @staticmethod
    def get_user_by_id(session, id):
        return session.query(User).filter_by(id=id, status=STATUS.ACTIVE).first()

    @staticmethod
    def get_user_by_email(session, email):
        return session.query(User).filter_by(email=email, status=STATUS.ACTIVE).first()
    
    @staticmethod
    def admin_get_user_by_email(session, email):
        """ Get user by email regardless of status """
        return session.query(User).filter_by(email=email).first()
    
    @staticmethod
    def get_users_by_membership(session, membership):
        return session.query(User).filter_by(membership=membership, status=STATUS.ACTIVE).all()

    @staticmethod
    def add_user(
        session,
        name,
        password,
        email,
        gender=GENDER.MALE,
        membership=MEMBERSHIP.NORMAL,
        status=STATUS.ACTIVE
    ):
        if User.admin_get_user_by_email(session, email):
            raise ValueError("The email is already in use.")

        user = User(
            email=email,
            name=name,
            gender=gender,
            membership=membership,
            status=status
        )
        user.password = password # separate from __init__ to use password.setter
        session.add(user)
        session.flush()

    @staticmethod
    def change_name(session, email, new_name):
        user = User.get_user_by_email(session, email)
        if user:
            user.name = new_name
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")
    
    @staticmethod
    def change_gender(session, email, new_gender):
        if new_gender not in GENDER.values():
            raise ValueError("Invalid gender value")
        
        user = User.get_user_by_email(session, email)
        if user:
            user.gender = new_gender
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")
    
    @staticmethod
    def change_profile_picture_url(session, email, new_profile_picture_url):
        user = User.get_user_by_email(session, email)
        if user:
            user.profile_picture_url = new_profile_picture_url
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")

    @staticmethod
    def change_email(session, old_email, new_email):
        if User.get_user_by_email(session, new_email):
            raise ValueError("The new email is already in use.")
        
        user = User.get_user_by_email(session, old_email)
        if user:
            user.email = new_email
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the old email does not exist.")

    @staticmethod
    def change_password(session, email, old_password, new_password):
        user = User.get_user_by_email(session, email)
        if user:
            if Bcrypt().check_password_hash(user.password_hash, old_password):
                user.password = new_password
                user.updated = func.now()
                session.flush()
            else:
                raise ValueError("The old password is incorrect.")
        else:
            raise ValueError("User with the email does not exist.")
    
    @staticmethod
    def change_membership(session, email, new_membership):
        if new_membership not in MEMBERSHIP.values():
            raise ValueError("Invalid membership value")
        
        user = User.admin_get_user_by_email(session, email)
        if user:
            user.membership = new_membership
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")
    
    @staticmethod
    def change_status(session, email, new_status):
        if new_status not in STATUS.values():
            raise ValueError("Invalid status value")
        
        user = User.admin_get_user_by_email(session, email)
        if user:
            user.status = new_status
            user.updated = func.now()
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")
    
    @staticmethod
    def delete_user(session, email):
        user = User.get_user_by_email(session, email)
        if user:
            session.delete(user)
            session.flush()
        else:
            raise ValueError("User with the email does not exist.")

    def __repr__(self):
        return f'<User {self.email}>'