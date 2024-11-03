import os
from flask import Flask, request
from dotenv import load_dotenv
from flask_restx import Api, Namespace
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    set_access_cookies,
    create_access_token,
    get_jwt,
    get_jwt_identity
)

from database import init_db, check_db, create_tables

load_dotenv()

APP_NAME = 'MobiLearn'
VERSION = '1.0'
app = Flask(__name__)
api = Api(app, version=VERSION, title=APP_NAME, description=f"{APP_NAME} API")
jwt = JWTManager(app)
CORS(app, resources={r"/*": {
    "origins": "*",
    "allow_headers": ["Content-Type", "Authorization"],
}})

# api paths under namespaces automatically have name prepended 
ns_auth = Namespace(name='auth', description='Authentication operations')
ns_account = Namespace(name='account', description='Account operations')
ns_recommender = Namespace(name='recommender', description='Recommender system operations')
ns_channel = Namespace(name='channel', description='Channel operations')
ns_course = Namespace(name='course', description='Course operations')
ns_internal = Namespace(name='internal', description='Internal operations')

POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 86400
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

init_db(app)

def setup_environment():
    """ Setup flask app environment """
    with app.app_context():
        from models import (
            user,
            instructor,
            # admin
            # channel,
            # course
        )

        create_tables()
        check_db()

def init_auth_endpoints():
    from endpoints.auth.signup import UserSignupEndpoint, InstructorSignupEndpoint
    from endpoints.auth.login import UserLoginEndpoint, InstructorLoginEndpoint

    user_signup_path = f"/{VERSION}/user/signup"
    ns_auth.add_resource(UserSignupEndpoint, user_signup_path)

    instructor_signup_path = f"/{VERSION}/instructor/signup"
    ns_auth.add_resource(InstructorSignupEndpoint, instructor_signup_path)

    user_login_path = f"/{VERSION}/user/login"
    ns_auth.add_resource(UserLoginEndpoint, user_login_path)

    instructor_login_path = f"/{VERSION}/instructor/login"
    ns_auth.add_resource(InstructorLoginEndpoint, instructor_login_path)

def init_account_endpoints():
    pass

def init_course_endpoints():
    from endpoints.course.course import CourseEndpoint

    course_path = f"/{VERSION}/addCourse"
    ns_course.add_resource(CourseEndpoint, course_path)

def init_channel_endpoints():
    from endpoints.channel.channel import ChannelEndpoint

    channel_path = f"/{VERSION}/addChannel"
    ns_channel.add_resource(ChannelEndpoint, channel_path)


def init_recommender_endpoints():
    pass

def init_internal_endpoints():
    pass

def init():
    """ Startup local environment, API warmup, namespaces, etc """
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        setup_environment()

    init_auth_endpoints()
    api.add_namespace(ns_auth)

    init_course_endpoints()
    api.add_namespace(ns_course)

    init_channel_endpoints()
    api.add_namespace(ns_channel)

    init_recommender_endpoints()
    api.add_namespace(ns_recommender)

    init_internal_endpoints()
    api.add_namespace(ns_internal)
    
    return app

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 200
    
# @app.after_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#         return response
#     except (RuntimeError, KeyError):
#         return response

if __name__ == '__main__':
    init().run(host="0.0.0.0", port=8080, debug=True)