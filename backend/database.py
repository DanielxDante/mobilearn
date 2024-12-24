import csv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

COURSERA_DATASET_PATH = './data/coursera_cleaned.csv'

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
    session = sessionmaker(bind=db.engine)
    return session()

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
    """ Load initial data into database """
    load_channel()
    # load_communities()
    # load_courses()

def load_channel():
    """ Create a default public channel """
    from models.channel import Channel

    with session_scope() as session:
        Channel.add_channel(
            session,
            name='Public',
            description='MobiLearn public channel for all users',
            invite_code='mobilearn' 
        )

def load_communities():
    """ Load initial communities """
    from models.community import Community

    with session_scope() as session:
        Community.add_community(
            session,
            community_type='PUBLIC',
            name='Public',
            description='MobiLearn public community for all users',
            website_url='https://mobilearn.com'
        )

def load_courses():
    """ Load Kaggle Coursera dataset into public channel """
    with open(COURSERA_DATASET_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with session_scope() as session:
            for row in reader:
                # course = Course(
                #     course_id=row['course_id'],
                #     course_name=row['course_name'],
                #     university=row['university'],
                #     # Add other fields as necessary
                # )
                # session.add(course)
                pass
