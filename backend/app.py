# CREDITS: Daniel Tay Jin Hong

import os
import logging
from datetime import timedelta
from flask import Flask, request
from dotenv import load_dotenv
from flask_restx import Api, Namespace
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_mail import Mail

from database import db, init_db, check_db, create_tables, load_initial_data, create_session
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
ns_channel = Namespace(name='channel', description='Channel operations')
ns_community = Namespace(name='community', description='Community operations')
ns_course = Namespace(name='course', description='Course operations')
ns_chat = Namespace(name='chat', description='Chat operations')
ns_analytics = Namespace(name='analytics', description='Analytics operations')
ns_payment = Namespace(name='payment', description='Payment operations')
ns_admin = Namespace(name='admin', description='Admin operations')
ns_internal = Namespace(name='internal', description='Internal operations')

POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

# static configs
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["ADMIN_API_KEY"] = os.getenv('ADMIN_API_KEY')
app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = MAIL_USERNAME
app.config["MAIL_PASSWORD"] = MAIL_PASSWORD

# runtime configs
app.config["RECOMMENDATION_TYPE"] = "content"

mail = Mail(app)
init_db(app)

def setup_environment():
    """ Setup flask app environment """
    print(f"Setting up environment on {POSTGRES_HOST}.")

    with app.app_context():
        # do not import association tables
        from models import token
        from models import user
        from models import instructor
        from models import chat_participant
        from models import chat
        from models import message
        from models import channel
        from models import community
        from models import course
        from models import chapter
        from models import lesson
        from models import notification

        check_db()
        create_tables()
        load_initial_data()

        from utils.recommender_system import get_course_recommender
        _ = get_course_recommender()

def init_auth_endpoints():
    from endpoints.auth.signup import UserSignupEndpoint, InstructorSignupEndpoint
    from endpoints.auth.login import (
        UserLoginEndpoint, InstructorLoginEndpoint,
        UserForgetPasswordEndpoint, UserResetPasswordEndpoint,
        InstructorForgetPasswordEndpoint, InstructorResetPasswordEndpoint
    )
    from endpoints.auth.logout import RefreshTokenEndpoint, LogoutEndpoint

    user_signup_path = f"/{VERSION}/user/signup"
    ns_auth.add_resource(UserSignupEndpoint, user_signup_path)

    instructor_signup_path = f"/{VERSION}/instructor/signup"
    ns_auth.add_resource(InstructorSignupEndpoint, instructor_signup_path)

    user_login_path = f"/{VERSION}/user/login"
    ns_auth.add_resource(UserLoginEndpoint, user_login_path)

    user_forget_password_path = f"/{VERSION}/user/forgetPassword"
    ns_auth.add_resource(UserForgetPasswordEndpoint, user_forget_password_path)

    user_reset_password_path = f"/{VERSION}/user/resetPassword"
    ns_auth.add_resource(UserResetPasswordEndpoint, user_reset_password_path)

    instructor_login_path = f"/{VERSION}/instructor/login"
    ns_auth.add_resource(InstructorLoginEndpoint, instructor_login_path)

    instructor_forget_password_path = f"/{VERSION}/instructor/forgetPassword"
    ns_auth.add_resource(InstructorForgetPasswordEndpoint, instructor_forget_password_path)

    instructor_reset_password_path = f"/{VERSION}/instructor/resetPassword"
    ns_auth.add_resource(InstructorResetPasswordEndpoint, instructor_reset_password_path)

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
    from endpoints.account.notification import (
        GetUserUnreadNotificationsEndpoint,
        UserAddNotificationEndpoint,
        GetInstructorUnreadNotificationsEndpoint,
        InstructorAddNotificationEndpoint
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

    get_user_unread_notifications_path = f"/{VERSION}/user/notification/getUnread"
    ns_account.add_resource(GetUserUnreadNotificationsEndpoint, get_user_unread_notifications_path)

    add_user_notification_path = f"/{VERSION}/user/notification/add"
    ns_account.add_resource(UserAddNotificationEndpoint, add_user_notification_path)

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

    get_instructor_unread_notifications_path = f"/{VERSION}/instructor/notification/getUnread"
    ns_account.add_resource(GetInstructorUnreadNotificationsEndpoint, get_instructor_unread_notifications_path)

    add_instructor_notification_path = f"/{VERSION}/instructor/notification/add"
    ns_account.add_resource(InstructorAddNotificationEndpoint, add_instructor_notification_path)

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
    from endpoints.community.community import (
        GetCommunitiesEndpoint,
        GetCommunityInstructorsEndpoint,
        GetInstructorDetailsEndpoint
    )

    get_communities_path = f"/{VERSION}/community/getCommunities"
    ns_community.add_resource(GetCommunitiesEndpoint, get_communities_path)

    get_community_instructors_path = f"/{VERSION}/community/getInstructors/<string:community_id>"
    ns_community.add_resource(GetCommunityInstructorsEndpoint, get_community_instructors_path)

    get_instructor_details_path = f"/{VERSION}/community/getInstructorDetails/<string:instructor_id>"
    ns_community.add_resource(GetInstructorDetailsEndpoint, get_instructor_details_path)

def init_course_endpoints():
    from endpoints.course.course import (
        GetUnenrolledCourseEndpoint,
        GetEnrolledCourseEndpoint,
        SearchCoursesEndpoint,
        GetInstructorCoursesEndpoint,
        CreateCourseEndpoint,
        RetrieveCourseDetailsEndpoint,
        EditCourseEndpoint
    )
    from endpoints.course.review import GetUserCourseReviewEndpoint, SaveReviewEndpoint, GetReviewsEndpoint
    from endpoints.course.enroll import (
        GetUserEnrolledCoursesEndpoint,
        GetUserTopEnrolledCoursesEndpoint,
        EnrollUserEndpoint,
        WithdrawUserEndpoint,
        GetInstructorTopEnrolledCoursesEndpoint
    )
    from endpoints.course.favourite import (
        GetFavouriteCoursesEndpoint,
        AddFavouriteCourseEndpoint,
        RemoveFavouriteCourseEndpoint
    )
    from endpoints.course.recommender import GetRecommendedCoursesEndpoint
    from endpoints.course.lesson import (
        GetLessonDetailsEndpoint,
        PreviewLessonEndpoint,
        CompleteLessonEndpoint,
        SubmitHomeworkEndpoint
    )

    get_unenrolled_course_path = f"/{VERSION}/getUnenrolledCourse/<string:course_id>"
    ns_course.add_resource(GetUnenrolledCourseEndpoint, get_unenrolled_course_path)

    get_enrolled_course_path = f"/{VERSION}/getEnrolledCourse/<string:course_id>"
    ns_course.add_resource(GetEnrolledCourseEndpoint, get_enrolled_course_path)

    search_courses_path = f"/{VERSION}/search/<string:channel_id>"
    ns_course.add_resource(SearchCoursesEndpoint, search_courses_path)

    get_instructor_courses_path = f"/{VERSION}/instructor/getInstructorCourses"
    ns_course.add_resource(GetInstructorCoursesEndpoint, get_instructor_courses_path)

    create_course_path = f"/{VERSION}/instructor/create"
    ns_course.add_resource(CreateCourseEndpoint, create_course_path)

    retrieve_course_details_path = f"/{VERSION}/instructor/getCourseDetails/<string:course_id>"
    ns_course.add_resource(RetrieveCourseDetailsEndpoint, retrieve_course_details_path)

    edit_course_path = f"/{VERSION}/instructor/edit"
    ns_course.add_resource(EditCourseEndpoint, edit_course_path)

    get_user_course_review_path = f"/{VERSION}/user/getReview/<string:course_id>"
    ns_course.add_resource(GetUserCourseReviewEndpoint, get_user_course_review_path)

    save_course_review_path = f"/{VERSION}/user/saveReview"
    ns_course.add_resource(SaveReviewEndpoint, save_course_review_path)

    get_reviews_path = f"/{VERSION}/instructor/getReviews/<string:course_id>"
    ns_course.add_resource(GetReviewsEndpoint, get_reviews_path)

    get_user_enrolled_courses_path = f"/{VERSION}/user/getEnrolledCourses/<string:channel_id>"
    ns_course.add_resource(GetUserEnrolledCoursesEndpoint, get_user_enrolled_courses_path)

    get_user_top_enrolled_courses_path = f"/{VERSION}/user/getTopEnrolledCourses/<string:channel_id>"
    ns_course.add_resource(GetUserTopEnrolledCoursesEndpoint, get_user_top_enrolled_courses_path)

    get_instructor_top_enrolled_courses_path = f"/{VERSION}/instructor/getTopEnrolledCourses"
    ns_course.add_resource(GetInstructorTopEnrolledCoursesEndpoint, get_instructor_top_enrolled_courses_path)

    enroll_user_path = f"/{VERSION}/user/enrollCourse"
    ns_course.add_resource(EnrollUserEndpoint, enroll_user_path)

    withdraw_user_path = f"/{VERSION}/user/withdrawCourse"
    ns_course.add_resource(WithdrawUserEndpoint, withdraw_user_path)

    get_favourite_courses_path = f"/{VERSION}/user/getFavouriteCourses/<string:channel_id>"
    ns_course.add_resource(GetFavouriteCoursesEndpoint, get_favourite_courses_path)

    add_favourite_course_path = f"/{VERSION}/user/addFavouriteCourse"
    ns_course.add_resource(AddFavouriteCourseEndpoint, add_favourite_course_path)

    remove_favourite_course_path = f"/{VERSION}/user/removeFavouriteCourse"
    ns_course.add_resource(RemoveFavouriteCourseEndpoint, remove_favourite_course_path)

    get_recommended_courses_path = f"/{VERSION}/user/getRecommendedCourses/<string:channel_id>"
    ns_course.add_resource(GetRecommendedCoursesEndpoint, get_recommended_courses_path)

    get_lesson_details_path = f"/{VERSION}/user/getLessonDetails/<string:lesson_id>"
    ns_course.add_resource(GetLessonDetailsEndpoint, get_lesson_details_path)

    preview_lesson_path = f"/{VERSION}/instructor/previewLesson/<string:lesson_id>"
    ns_course.add_resource(PreviewLessonEndpoint, preview_lesson_path)

    complete_lesson_path = f"/{VERSION}/user/completeLesson"
    ns_course.add_resource(CompleteLessonEndpoint, complete_lesson_path)

    submit_homework_path = f"/{VERSION}/user/submitHomework"
    ns_course.add_resource(SubmitHomeworkEndpoint, submit_homework_path)

def init_chat_endpoints():
    from endpoints.chat.chat import (
        SearchParticipantsEndpoint,
        GetParticipantChatsEndpoint,
        GetChatDetailsEndpoint,
        CreatePrivateChatEndpoint,
        CreateGroupChatEndpoint,
        EditGroupChatNameEndpoint,
        EditGroupChatPictureEndpoint,
        AddGroupChatParticipantsEndpoint,
        RemoveGroupChatParticipantEndpoint,
        ElevateGroupChatAdminEndpoint
    )
    from endpoints.chat.message import GetChatMessagesEndpoint

    search_participants_path = f"/{VERSION}/searchParticipants"
    ns_chat.add_resource(SearchParticipantsEndpoint, search_participants_path)

    get_participant_chats_path = f"/{VERSION}/getParticipantChats/<string:participant_type>"
    ns_chat.add_resource(GetParticipantChatsEndpoint, get_participant_chats_path)

    get_chat_details_path = f"/{VERSION}/getChatDetails/<string:initiator_type>/<string:chat_id>"
    ns_chat.add_resource(GetChatDetailsEndpoint, get_chat_details_path)

    create_private_chat_path = f"/{VERSION}/createPrivateChat"
    ns_chat.add_resource(CreatePrivateChatEndpoint, create_private_chat_path)

    create_group_chat_path = f"/{VERSION}/createGroupChat"
    ns_chat.add_resource(CreateGroupChatEndpoint, create_group_chat_path)

    edit_group_chat_name_path = f"/{VERSION}/editGroupChatName"
    ns_chat.add_resource(EditGroupChatNameEndpoint, edit_group_chat_name_path)

    edit_group_chat_picture_path = f"/{VERSION}/editGroupChatPicture"
    ns_chat.add_resource(EditGroupChatPictureEndpoint, edit_group_chat_picture_path)

    add_group_chat_participant_path = f"/{VERSION}/addGroupChatParticipants"
    ns_chat.add_resource(AddGroupChatParticipantsEndpoint, add_group_chat_participant_path)

    remove_group_chat_participant_path = f"/{VERSION}/removeGroupChatParticipant"
    ns_chat.add_resource(RemoveGroupChatParticipantEndpoint, remove_group_chat_participant_path)

    elevate_group_chat_admin_path = f"/{VERSION}/elevateParticipantToAdmin"
    ns_chat.add_resource(ElevateGroupChatAdminEndpoint, elevate_group_chat_admin_path)

    get_chat_messages_path = f"/{VERSION}/getChatMessages/<string:chat_id>/<string:chat_participant_id>"
    ns_chat.add_resource(GetChatMessagesEndpoint, get_chat_messages_path)

def init_analytics_endpoints():
    from endpoints.analytics.analytics import (
        GetInstructorTotalLessons,
        GetInstructorTotalEnrollments,
        GetInstructorTotalReviews,
        GetInstructorAverageCourseProgress
    )

    get_instructor_total_lessons_path = f"/{VERSION}/instructor/totalLessons"
    ns_analytics.add_resource(GetInstructorTotalLessons, get_instructor_total_lessons_path)

    get_instructor_total_enrollments_path = f"/{VERSION}/instructor/totalEnrollments/<string:time_range>"
    ns_analytics.add_resource(GetInstructorTotalEnrollments, get_instructor_total_enrollments_path)

    get_instructor_total_reviews_path = f"/{VERSION}/instructor/totalReviews/<string:time_range>"
    ns_analytics.add_resource(GetInstructorTotalReviews, get_instructor_total_reviews_path)

    get_instructor_average_course_progress_path = f"/{VERSION}/instructor/averageCourseProgress/<string:time_range>"
    ns_analytics.add_resource(GetInstructorAverageCourseProgress, get_instructor_average_course_progress_path)

def init_payment_endpoints():
    from endpoints.payment.stripe import FetchPaymentSheetEndpoint

    fetch_payment_sheet_path = f"/{VERSION}/stripe/fetchPaymentSheet"
    ns_payment.add_resource(FetchPaymentSheetEndpoint, fetch_payment_sheet_path)

def init_admin_endpoints():
    from endpoints.admin.status import (
        ChangeUserStatusEndpoint,
        ChangeInstructorStatusEndpoint,
        ChangeChannelStatusEndpoint,
        ChangeCourseStatusEndpoint
    )
    from endpoints.admin.membership import ChangeUserMembershipEndpoint
    from endpoints.admin.channel import CreateChannelEndpoint
    from endpoints.admin.community import CreateCommunityEndpoint, AttachCommunityToChannelEndpoint
    from endpoints.admin.course import EnrollUserEndpoint
    from endpoints.admin.recommender import ChangeRecommendationTypeEndpoint

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

    enroll_user_path = f"/{VERSION}/course/enroll"
    ns_admin.add_resource(EnrollUserEndpoint, enroll_user_path)

    change_course_status_path = f"/{VERSION}/course/editStatus"
    ns_admin.add_resource(ChangeCourseStatusEndpoint, change_course_status_path)

    change_recommendation_type_path = f"/{VERSION}/recommender/editType"
    ns_admin.add_resource(ChangeRecommendationTypeEndpoint, change_recommendation_type_path)

def init_internal_endpoints():
    from endpoints.internal.health import CheckBasicHealthEndpoint

    check_basic_health_path = f"/{VERSION}/health/basic"
    ns_internal.add_resource(CheckBasicHealthEndpoint, check_basic_health_path)

def init():
    """ Startup local environment, API warmup, namespaces, etc """
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        setup_environment()

    init_auth_endpoints()
    api.add_namespace(ns_auth)

    init_account_endpoints()
    api.add_namespace(ns_account)

    init_channel_endpoints()
    api.add_namespace(ns_channel)

    init_community_endpoints()
    api.add_namespace(ns_community)

    init_course_endpoints()
    api.add_namespace(ns_course)

    init_chat_endpoints()
    api.add_namespace(ns_chat)

    init_analytics_endpoints()
    api.add_namespace(ns_analytics)

    init_payment_endpoints()
    api.add_namespace(ns_payment)

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

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 200

if __name__ == '__main__':
    # consider changing to using gunicorn runtime server for production
    socketio.run(init(), host="0.0.0.0", port=8080, debug=False, use_reloader=True, allow_unsafe_werkzeug=True)