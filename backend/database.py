import os
import re
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base
from contextlib import contextmanager

db = SQLAlchemy()
Base = declarative_base()

def init_db(app):
    db.init_app(app)

def check_db():
    """ Check PostgreSQL database connection """
    try:
        with db.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            conn.close()
    except OperationalError as e:
        raise RuntimeError(f"PostgreSQL database connection failed: {e}")

def create_tables():
    """ Initialise PostgreSQL database tables """
    Base.metadata.create_all(bind=db.engine)

def create_session():
    """ Create a session for apis """
    return db.session

@contextmanager
def session_scope():
    """ 
    Provide a scope around a series of operations   
    Used for POST requests
    """
    session = create_session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()

def load_initial_data():
    """ Load initial data into PostgreSQL database """
    # TODO: Load initial data into database after data is finalised
    pass

