from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

db = SQLAlchemy()

def init_app(app):
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
    # Should the database reset on each startup?
    db.create_all()

def load_initial_data():
    """ Load initial data into PostgreSQL database """
    # TODO: Load initial data into database after data is finalised
    pass