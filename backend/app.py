import os
from flask import Flask
from dotenv import load_dotenv
from flask_restx import Api, Namespace
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from database import db, check_db, create_tables

load_dotenv()

APP_NAME = 'MobiLearn'
VERSION = '1.0'
app = Flask(__name__)
api = Api(app, version=VERSION, title=APP_NAME, description=f"{APP_NAME} API")
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}}, origins="*")

# api paths under namespaces automatically have name prepended 
ns_auth = Namespace(name='auth', description='Authentication operations')
ns_user = Namespace(name='user', description='User operations')
ns_instructor = Namespace(name='instructor', description='Instructor operations')
ns_admin = Namespace(name='admin', description='Adminstrator operations')
ns_recommender = Namespace(name='recommender', description='Recommender system operations')
ns_internal = Namespace(name='internal', description='Internal operations') # optional

POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

def setup_environment():
    """ Setup flask app environment """
    db.init_app(app)
    with app.app_context():
        from models import user

        create_tables()
        check_db()

def init_auth_endpoints():
    from endpoints.auth.signup import SignupEndpoint
    from endpoints.auth.login import LoginEndpoint

    signup_path = f"/{VERSION}/signup"
    ns_auth.add_resource(SignupEndpoint, signup_path)

    login_path = f"/{VERSION}/login"
    ns_auth.add_resource(LoginEndpoint, login_path)

def init_user_endpoints():
    pass

def init_instructor_endpoints():
    pass

def init_admin_endpoints():
    pass

def init_recommender_endpoints():
    pass

def init_internal_endpoints():
    pass

def init():
    """ Startup local environment, API warmup, namespaces, etc """
    setup_environment()

    init_auth_endpoints()
    api.add_namespace(ns_auth)

    init_user_endpoints()
    api.add_namespace(ns_user)

    init_instructor_endpoints()
    api.add_namespace(ns_instructor)

    init_admin_endpoints()
    api.add_namespace(ns_admin)

    init_recommender_endpoints()
    api.add_namespace(ns_recommender)

    init_internal_endpoints()
    api.add_namespace(ns_internal)

    return app

if __name__ == '__main__':
    init().run(host="0.0.0.0", port=8080, debug=True)