import json
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from models.user import User, STATUS as USER_STATUS
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.channel import Channel, STATUS as CHANNEL_STATUS
from models.course import Course, STATUS as COURSE_STATUS
from utils.admin_decorator import require_admin_key
from services.notification_services import NotificationService

change_user_status_parser = api.parser()
change_user_status_parser.add_argument('user_email', type=str, help='User Email', location='json', required=True)
change_user_status_parser.add_argument(
    'new_status',
    type=str,
    help='New Status',
    location='json',
    required=True,
    choices=USER_STATUS.values()
)

class ChangeUserStatusEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "user_email": "foobar@gmail.com",
                "new_status": "disabled"
            }
            """
    )
    @api.expect(change_user_status_parser)
    @require_admin_key
    def post(self):
        """ Change user status """
        data = request.get_json()
        email = data.get('user_email')
        new_status = data.get('new_status')
        
        with session_scope() as session:
            try:
                User.change_status(session, email, new_status)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': '(Admin) User status changed successfully'}),
            status=200, mimetype='application/json'
        )
    
change_instructor_status_parser = api.parser()
change_instructor_status_parser.add_argument(
    'instructor_email', 
    type=str,
    help='Instructor Email',
    location='json',
    required=True
)
change_instructor_status_parser.add_argument(
    'new_status',
    type=str,
    help='New Status',
    location='json',
    required=True,
    choices=INSTRUCTOR_STATUS.values()
)

class ChangeInstructorStatusEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            403: 'Forbidden',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "instructor_email": "foobar@e.ntu.edu.com",
                "new_status": "active"
            }
            """
    )
    @api.expect(change_instructor_status_parser)
    @require_admin_key
    def post(self):
        """ Change instructor status """
        data = request.get_json()
        email = data.get('instructor_email')
        new_status = data.get('new_status')
        
        with session_scope() as session:
            try:
                instructor = Instructor.admin_get_instructor_by_email(session, email)
                if not instructor:
                    raise ValueError("Instructor with the email does not exist.")
                
                Instructor.change_status(session, email, new_status)
                
                if new_status == 'active':
                    NotificationService.add_notification(
                        session,
                        title="Congratulations!",
                        body="Your account has been approved. Start creating courses with MobiLearn today!",
                        notification_type="info",
                        recipient_id=instructor.id,
                        recipient_type='instructor'
                    )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': '(Admin) Instructor status changed successfully'}),
            status=200, mimetype='application/json'
        )
    
change_channel_status_parser = api.parser()
change_channel_status_parser.add_argument(
    'channel_id', 
    type=str,
    help='Channel ID',
    location='json',
    required=True
)
change_channel_status_parser.add_argument(
    'new_status',
    type=str,
    help='New Status',
    location='json',
    required=True,
    choices=CHANNEL_STATUS.values()
)

class ChangeChannelStatusEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            403: 'Forbidden',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "channel_id": "1",
                "new_status": "disabled"
            }
            """
    )
    @api.expect(change_channel_status_parser)
    @require_admin_key
    def post(self):
        """ Change channel status """
        data = request.get_json()
        channel_id = data.get('channel_id')
        new_status = data.get('new_status')
        
        with session_scope() as session:
            try:
                Channel.change_status(session, channel_id, new_status)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': '(Admin) Channel status changed successfully'}),
            status=200, mimetype='application/json'
        )

change_course_status_parser = api.parser()
change_course_status_parser.add_argument(
    'course_id', 
    type=str,
    help='Course ID',
    location='json',
    required=True
)
change_course_status_parser.add_argument(
    'new_status',
    type=str,
    help='New Status',
    location='json',
    required=True,
    choices=COURSE_STATUS.values()
)

class ChangeCourseStatusEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            403: 'Forbidden',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "course_id": 421,
                "new_status": "approved"
            }
            """
    )
    @api.expect(change_course_status_parser)
    @require_admin_key
    def post(self):
        """ Change course status """
        data = request.get_json()
        course_id = data.get('course_id')
        new_status = data.get('new_status')
        
        with session_scope() as session:
            try:
                Course.change_status(session, course_id, new_status)

                # if new_status == 'active':
                #     NotificationService.add_notification(
                #         session,
                #         title="Congratulations!",
                #         body="Your account has been approved. Start creating courses with MobiLearn today!",
                #         notification_type="info",
                #         recipient_id=instructor.id,
                #         recipient_type='instructor'
                #     )
                return Response(
                    json.dumps({'message': '(Admin) Course status changed successfully'}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as e:
                return Response(
                    json.dumps({'message': str(e)}),
                    status=500, mimetype='application/json'
                )
        