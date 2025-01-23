import json
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from models.user import User, GENDER, MEMBERSHIP
from models.instructor import Instructor
from models.community import Community
from services.community_services import CommunityService
from services.notification_services import NotificationService

userSignupParser = api.parser()
userSignupParser.add_argument('name', type=str, help='Full Name', location='json', required=True)
userSignupParser.add_argument('password', type=str, help='Password', location='json', required=True)
userSignupParser.add_argument('email', type=str, help='Email', location='json', required=True)
userSignupParser.add_argument('gender', type=str, help='Gender', location='json', required=True, choices=GENDER)
userSignupParser.add_argument('membership', type=str, help='Membership', location='json', required=False, choices=MEMBERSHIP)
userSignupParser.add_argument('device_token', type=str, help='Device Token', location='json', required=False)

class UserSignupEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        description="""
        Example request JSON:

        {
            "name": "foo",
            "password": "bar",
            "email": "foobar@gmail.com",
            "gender": "male",
            "device_token": "xxx" // optional for push notifications
        }
        """
    )
    @api.expect(userSignupParser)
    def post(self):
        """ Registers an account for a user """
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')
        gender = data.get('gender')
        membership = data.get('membership') if 'membership' in data else MEMBERSHIP.NORMAL
        device_token = data.get('device_token', None)

        with session_scope() as session:
            try:
                user = User.add_user(session, name, password, email, gender, membership)
                if device_token:
                    user.device_token = device_token

                # send a welcome notification
                NotificationService.add_notification(
                    session,
                    title="Welcome!",
                    body="Start learning with MobiLearn today!",
                    notification_type="info",
                    recipient_id=user.id,
                    recipient_type='user'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=500, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'User signup successful'}),
            status=200, mimetype='application/json'
        )


instructorSignupParser = api.parser()
instructorSignupParser.add_argument('name', type=str, help='Full Name', location='json', required=True)
instructorSignupParser.add_argument('password', type=str, help='Password', location='json', required=True)
instructorSignupParser.add_argument('email', type=str, help='Email', location='json', required=True)
instructorSignupParser.add_argument('gender', type=str, help='Gender', location='json', required=True, choices=GENDER)
instructorSignupParser.add_argument('phone_number', type=str, help='Phone Number', location='json', required=True)
instructorSignupParser.add_argument('company', type=str, help='Company', location='json', required=True)
instructorSignupParser.add_argument('position', type=str, help='Position', location='json', required=True)
instructorSignupParser.add_argument('device_token', type=str, help='Device Token', location='json', required=False)

class InstructorSignupEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        description="""
        Instructors need to be approved by the admin before they can access the app.
        Example request JSON:

        {
            "name": "foo",
            "password": "bar",
            "email": "foobar@e.ntu.edu.sg",
            "gender": "male",
            "phone_number": "12345678",
            "company": "MobiLearn Network",
            "position": "Lecturer",
            "device_token": "xxx" // optional for push notifications
        }
        """
    )
    @api.expect(instructorSignupParser)
    def post(self):
        """ Registers an account for an instructor """
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        email = data.get('email')
        gender = data.get('gender')
        phone_number = data.get('phone_number')
        company = data.get('company')
        position = data.get('position')
        device_token = data.get('device_token', None)

        with session_scope() as session:
            try:
                community = Community.get_community_by_name(session, company)

                instructor = Instructor.add_instructor(
                    session,
                    name,
                    password,
                    email,
                    phone_number,
                    company,
                    position,
                    gender
                )
                CommunityService.attach_instructor(session, community.id, instructor.id)
                if device_token:
                    instructor.device_token = device_token

                # Send a notification to the admin for approval
                # This can be done through a messaging service or email e.g., MailTrap

                # send a welcome notification
                NotificationService.add_notification(
                    session,
                    title="Welcome!",
                    body="Start creating courses with MobiLearn today!",
                    notification_type="info",
                    recipient_id=instructor.id,
                    recipient_type='instructor'
                )

                return Response(
                    json.dumps({'message': 'Instructor signup successful'}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=500, mimetype='application/json'
                )
        