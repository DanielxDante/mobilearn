from sqlalchemy import Enum, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import db
from . import STATUSES

# split instructor into separate class
# if the attributes between the different tiers of users are too different,
# consider creating separate classes for each tier of user

ROLES = ('member', 'instructor', 'admin')
GENDERS = ('male', 'female')

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(*ROLES), nullable=False, default='member')
    gender = Column(Enum(*GENDERS), nullable=False, default='male')
    profile_picture_url = Column(String, nullable=True) # CDN link to profile picture
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    latest_login = Column(DateTime, nullable=False)
    status = Column(Enum(*STATUSES), nullable=False, default='active')

    # Many-to-many relationship with Group
    group_associations = relationship("UserGroup", back_populates="user", cascade="all, delete-orphan")
    groups = association_proxy('group_associations', 'group')

    # One-to-many relationship with Message
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")

    # Many-to=many relationship with Channel
    channel_associations = relationship("UserChannel", back_populates="user")
    channels = association_proxy('channel_associations', 'channel')

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
    def add_user(username, password, email, role, gender):
        user = User(
            username=username,
            email=email,
            role=role,
            gender=gender)
        user.password = password # separate from __init__ to use password.setter
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def change_password(email, password):
        user = User.query.filter_by(email=email).first()
        user.password = password
        db.session.commit()
    
    @staticmethod
    def get_users():
        return User.query.all()
    
    @staticmethod
    def get_users_role(role):
        return User.query.filter_by(role=role).all()
    
    @staticmethod
    def get_user_by_id(id):
        return User.query.get(id)

    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()
    
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    def __repr__(self):
        return f'<User {self.email}>'