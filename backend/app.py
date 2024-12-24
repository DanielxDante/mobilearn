import os
import logging
from datetime import timedelta
from flask import Flask, request
from dotenv import load_dotenv
from flask_restx import Api, Namespace
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

from database import db, init_db, check_db, create_tables, load_initial_data
from models.token import TokenBlocklist

logging = logging.getLogger(__name__)

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
socketio = SocketIO(app, cors_allowed_origins="*")

# api paths under namespaces automatically have name prepended 
ns_auth = Namespace(name='auth', description='Authentication operations')
ns_account = Namespace(name='account', description='Account operations')
ns_recommender = Namespace(name='recommender', description='Recommender system operations')
ns_channel = Namespace(name='channel', description='Channel operations')
ns_community = Namespace(name='community', description='Community operations')
ns_course = Namespace(name='course', description='Course operations')
ns_admin = Namespace(name='admin', description='Admin operations')
ns_internal = Namespace(name='internal', description='Internal operations')

POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["ADMIN_API_KEY"] = os.getenv('ADMIN_API_KEY')

init_db(app)

def setup_environment():
    """ Setup flask app environment """
    with app.app_context():
        # do not import association tables here
        from models import token
        from models import user
        from models import instructor
        from models import chat
        from models import message
        from models import channel
        from models import community
        from models import course

        create_tables()
        check_db()
        load_initial_data()

def init_auth_endpoints():
    from endpoints.auth.signup import UserSignupEndpoint, InstructorSignupEndpoint
    from endpoints.auth.login import UserLoginEndpoint, InstructorLoginEndpoint
    from endpoints.auth.logout import RefreshTokenEndpoint, LogoutEndpoint

    user_signup_path = f"/{VERSION}/user/signup"
    ns_auth.add_resource(UserSignupEndpoint, user_signup_path)

    instructor_signup_path = f"/{VERSION}/instructor/signup"
    ns_auth.add_resource(InstructorSignupEndpoint, instructor_signup_path)

    user_login_path = f"/{VERSION}/user/login"
    ns_auth.add_resource(UserLoginEndpoint, user_login_path)

    instructor_login_path = f"/{VERSION}/instructor/login"
    ns_auth.add_resource(InstructorLoginEndpoint, instructor_login_path)

    refresh_token_path = f"/{VERSION}/refresh"
    ns_auth.add_resource(RefreshTokenEndpoint, refresh_token_path)

    logout_path = f"/{VERSION}/logout"
    ns_auth.add_resource(LogoutEndpoint, logout_path)

def init_account_endpoints():
    from endpoints.account.profile import (
        GetUserNameEndpoint, ChangeUserNameEndpoint, 
        GetUserGenderEndpoint, ChangeUserGenderEndpoint,
        GetUserProfilePictureEndpoint, ChangeUserProfilePictureEndpoint,
        GetInstructorNameEndpoint, ChangeInstructorNameEndpoint,
        GetInstructorGenderEndpoint, ChangeInstructorGenderEndpoint,
        GetInstructorProfilePictureEndpoint, ChangeInstructorProfilePictureEndpoint,
        GetInstructorPhoneNumberEndpoint, ChangeInstructorPhoneNumberEndpoint,
        GetInstructorPositionEndpoint, ChangeInstructorPositionEndpoint
    )
    from endpoints.account.security import (
        ChangeUserEmailEndpoint, ChangeUserPasswordEndpoint,
        ChangeInstructorEmailEndpoint, ChangeInstructorPasswordEndpoint,
        ChangeInstructorCompanyEndpoint
    )

    get_user_name_path = f"/{VERSION}/user/profile/getName"
    ns_account.add_resource(GetUserNameEndpoint, get_user_name_path)

    change_user_name_path = f"/{VERSION}/user/profile/editName"
    ns_account.add_resource(ChangeUserNameEndpoint, change_user_name_path)

    get_user_gender_path = f"/{VERSION}/user/profile/getGender"
    ns_account.add_resource(GetUserGenderEndpoint, get_user_gender_path)

    change_user_gender_path = f"/{VERSION}/user/profile/editGender"
    ns_account.add_resource(ChangeUserGenderEndpoint, change_user_gender_path)

    get_user_profile_picture_path = f"/{VERSION}/user/profile/getProfilePicture"
    ns_account.add_resource(GetUserProfilePictureEndpoint, get_user_profile_picture_path)

    change_user_profile_picture_path = f"/{VERSION}/user/profile/editProfilePicture"
    ns_account.add_resource(ChangeUserProfilePictureEndpoint, change_user_profile_picture_path)

    change_user_email_path = f"/{VERSION}/user/security/editEmail"
    ns_account.add_resource(ChangeUserEmailEndpoint, change_user_email_path)

    change_user_password_path = f"/{VERSION}/user/security/editPassword"
    ns_account.add_resource(ChangeUserPasswordEndpoint, change_user_password_path)

    #####################################################################################

    get_instructor_name_path = f"/{VERSION}/instructor/profile/getName"
    ns_account.add_resource(GetInstructorNameEndpoint, get_instructor_name_path)

    change_instructor_name_path = f"/{VERSION}/instructor/profile/editName"
    ns_account.add_resource(ChangeInstructorNameEndpoint, change_instructor_name_path)

    get_instructor_gender_path = f"/{VERSION}/instructor/profile/getGender"
    ns_account.add_resource(GetInstructorGenderEndpoint, get_instructor_gender_path)

    change_instructor_gender_path = f"/{VERSION}/instructor/profile/editGender"
    ns_account.add_resource(ChangeInstructorGenderEndpoint, change_instructor_gender_path)

    get_instructor_profile_picture_path = f"/{VERSION}/instructor/profile/getProfilePicture"
    ns_account.add_resource(GetInstructorProfilePictureEndpoint, get_instructor_profile_picture_path)

    change_instructor_profile_picture_path = f"/{VERSION}/instructor/profile/editProfilePicture"
    ns_account.add_resource(ChangeInstructorProfilePictureEndpoint, change_instructor_profile_picture_path)

    get_instructor_phone_number_path = f"/{VERSION}/instructor/profile/getPhoneNumber"
    ns_account.add_resource(GetInstructorPhoneNumberEndpoint, get_instructor_phone_number_path)

    change_instructor_phone_number_path = f"/{VERSION}/instructor/profile/editPhoneNumber"
    ns_account.add_resource(ChangeInstructorPhoneNumberEndpoint, change_instructor_phone_number_path)

    get_instructor_position_path = f"/{VERSION}/instructor/profile/getPosition"
    ns_account.add_resource(GetInstructorPositionEndpoint, get_instructor_position_path)

    change_instructor_position_path = f"/{VERSION}/instructor/profile/editPosition"
    ns_account.add_resource(ChangeInstructorPositionEndpoint, change_instructor_position_path)

    change_instructor_email_path = f"/{VERSION}/instructor/security/editEmail"
    ns_account.add_resource(ChangeInstructorEmailEndpoint, change_instructor_email_path)

    change_instructor_password_path = f"/{VERSION}/instructor/security/editPassword"
    ns_account.add_resource(ChangeInstructorPasswordEndpoint, change_instructor_password_path)

    change_instructor_company_path = f"/{VERSION}/instructor/security/editCompany"
    ns_account.add_resource(ChangeInstructorCompanyEndpoint, change_instructor_company_path)

def init_channel_endpoints():
    from endpoints.channel.channel import (
        GetUserChannelsEndpoint,
        InviteUserToChannelEndpoint
    )

    get_user_channels_path = f"/{VERSION}/channel/getUserChannels"
    ns_channel.add_resource(GetUserChannelsEndpoint, get_user_channels_path)

    invite_user_to_channel_path = f"/{VERSION}/channel/inviteUser"
    ns_channel.add_resource(InviteUserToChannelEndpoint, invite_user_to_channel_path)

def init_community_endpoints():
    from endpoints.community.community import GetCommunitiesEndpoint

    get_communities_path = f"/{VERSION}/community/getCommunities"
    ns_community.add_resource(GetCommunitiesEndpoint, get_communities_path)

def init_course_endpoints():
    from endpoints.course.course import CourseEndpoint

    course_path = f"/{VERSION}/addCourse"
    ns_course.add_resource(CourseEndpoint, course_path)

def init_recommender_endpoints():
    pass

def init_admin_endpoints():
    from endpoints.admin.status import (
        ChangeUserStatusEndpoint,
        ChangeInstructorStatusEndpoint,
        ChangeChannelStatusEndpoint
    )
    from endpoints.admin.membership import ChangeUserMembershipEndpoint
    from endpoints.admin.channel import CreateChannelEndpoint
    from endpoints.admin.community import CreateCommunityEndpoint, AttachCommunityToChannelEndpoint

    change_user_status_path = f"/{VERSION}/user/editStatus"
    ns_admin.add_resource(ChangeUserStatusEndpoint, change_user_status_path)

    change_instructor_status_path = f"/{VERSION}/instructor/editStatus"
    ns_admin.add_resource(ChangeInstructorStatusEndpoint, change_instructor_status_path)

    change_channel_status_path = f"/{VERSION}/channel/editStatus"
    ns_admin.add_resource(ChangeChannelStatusEndpoint, change_channel_status_path)

    change_user_membership_path = f"/{VERSION}/user/editMembership"
    ns_admin.add_resource(ChangeUserMembershipEndpoint, change_user_membership_path)

    create_channel_path = f"/{VERSION}/channel/create"
    ns_admin.add_resource(CreateChannelEndpoint, create_channel_path)

    create_community_path = f"/{VERSION}/community/create"
    ns_admin.add_resource(CreateCommunityEndpoint, create_community_path)

    attach_community_to_channel_path = f"/{VERSION}/community/attach"
    ns_admin.add_resource(AttachCommunityToChannelEndpoint, attach_community_to_channel_path)

def init_internal_endpoints():
    pass

def init():
    """ Startup local environment, API warmup, namespaces, etc """
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        setup_environment()

    init_auth_endpoints()
    api.add_namespace(ns_auth)

    init_account_endpoints()
    api.add_namespace(ns_account)

    init_course_endpoints()
    api.add_namespace(ns_course)

    init_channel_endpoints()
    api.add_namespace(ns_channel)

    init_community_endpoints()
    api.add_namespace(ns_community)

    init_recommender_endpoints()
    api.add_namespace(ns_recommender)

    init_admin_endpoints()
    api.add_namespace(ns_admin)

    init_internal_endpoints()
    api.add_namespace(ns_internal)
    
    return app

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token_type = jwt_payload["type"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti, token_type=token_type).first()

    return token is not None

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 200

if __name__ == '__main__':
    socketio.run(init(), host="0.0.0.0", port=8080, debug=True)