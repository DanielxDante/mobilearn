from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

from database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

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
    def add_user(username, password, email):
        user = User(username=username, email=email)
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
    def get_user_by_id(id):
        return User.query.get(id)

    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()
    
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    def __repr__(self):
        return f'<User {self.username}>'