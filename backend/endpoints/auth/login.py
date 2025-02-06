import json
import secrets
from datetime import datetime, timedelta, timezone
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)
from flask_mail import Message
from sqlalchemy import func

from app import api, mail, MAIL_USERNAME
from database import session_scope, create_session
from models.user import User, STATUS
from models.instructor import Instructor
from utils.generate_email import generate_qr_code, generate_reset_email_html

userLoginParser = api.parser()
userLoginParser.add_argument('email', type=str, help='Email', location='json', required=True)
userLoginParser.add_argument('password', type=str, help='Password', location='json', required=True)

class UserLoginEndpoint(Resource):
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
            "email": "foobar@gmail.com",
            "password": "bar"
        }
        """
    )
    @api.expect(userLoginParser)
    def post(self):
        """ Logs in a user """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        with session_scope() as session:
            try:
                user = User.get_user_by_email(session, email)

                if not user or not Bcrypt().check_password_hash(user.password_hash, password):
                    return Response(
                        json.dumps({'message': 'Invalid credentials'}),
                        status=400, mimetype='application/json'
                    )

                if user.status == STATUS.DISABLED:
                    return Response(
                        json.dumps({'message': 'User disabled'}),
                        status=400, mimetype='application/json'
                    )

                # update latest_login
                user.latest_login = func.now()

                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                name = user.name
                gender = user.gender
                profile_picture_url = user.profile_picture_url if user.profile_picture_url else ""
                membership = user.membership
                status = user.status
                response = Response(
                    json.dumps({
                        'name': name,
                        'gender': gender,
                        'profile_picture_url': profile_picture_url,
                        'membership': membership,
                        'status': status,
                        'access_token': f"Bearer {access_token}",
                        'refresh_token': f"Bearer {refresh_token}"
                    }),
                    status=200, mimetype='application/json'
                )

                return response
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

instructorLoginParser = api.parser()
instructorLoginParser.add_argument('email', type=str, help='Email', location='json', required=True)
instructorLoginParser.add_argument('password', type=str, help='Password', location='json', required=True)

class InstructorLoginEndpoint(Resource):
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
            "email": "foobar@e.ntu.edu.sg",
            "password": "bar"
        }
        """
    )
    @api.expect(instructorLoginParser)
    def post(self):
        """ Logs in an instructor """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_email(session, email)

                if instructor.status == STATUS.DISABLED:
                    return Response(
                        json.dumps({'message': 'Instructor disabled'}),
                        status=400, mimetype='application/json'
                    )

                if not Bcrypt().check_password_hash(instructor.password_hash, password):
                    return Response(
                        json.dumps({'message': 'Invalid credentials'}),
                        status=400, mimetype='application/json'
                    )

                # update latest_login
                instructor.latest_login = func.now()

                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                name = instructor.name
                gender = instructor.gender
                profile_picture_url = instructor.profile_picture_url if instructor.profile_picture_url else ""
                phone_number = instructor.phone_number
                company = instructor.company
                position = instructor.position
                status = instructor.status
                response =  Response(
                    json.dumps({
                        'name': name,
                        'gender': gender,
                        'profile_picture_url': profile_picture_url,
                        'phone_number': phone_number,
                        'company': company,
                        'position': position,
                        'status': status,
                        'access_token': f"Bearer {access_token}",
                        'refresh_token': f"Bearer {refresh_token}"
                    }),
                    status=200, mimetype='application/json'
                )
                
                return response
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

userForgetPasswordParser = api.parser()
userForgetPasswordParser.add_argument('email', type=str, help='Email', location='json', required=True)

class UserForgetPasswordEndpoint(Resource):
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
            "email": "foobar@gmail.com"
        }
        """
    )
    @api.expect(userForgetPasswordParser)
    def post(self):
        """ Initiates the password reset process for a user """
        data = request.get_json()
        email = data.get('email')
        
        with session_scope() as session:
            try:
                user = User.get_user_by_email(session, email)
                # if not user:
                #     return Response(
                #         json.dumps({'message': 'User not found'}),
                #         status=400, mimetype='application/json'
                #     )
                
                reset_token = secrets.token_urlsafe(32)
                if user:
                    user.reset_token = reset_token
                    user.reset_token_expiry = func.now() + timedelta(hours=1)

                # deep link using expo app scheme
                # com.musketeers.mobilearn
                reset_url = f"mobilearn://shared/newPassword?token={reset_token}"

                qr_code_io = generate_qr_code(reset_url)

                msg = Message(
                    subject="Reset Password",
                    sender=MAIL_USERNAME,
                    recipients=[email],
                    html=generate_reset_email_html(reset_url)
                )

                msg.attach("qr.png", "image/png", qr_code_io.read(), "inline", {"Content-ID": "<qr_code>"})
                mail.send(msg)

                return Response(
                    json.dumps({'message': 'Password reset email sent'}),
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

userForgetPasswordParser = api.parser()
userForgetPasswordParser.add_argument('reset_token', type=str, help='Reset token', location='json', required=True)
userForgetPasswordParser.add_argument('new_password', type=str, help='New password', location='json', required=True)

class UserResetPasswordEndpoint(Resource):
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
            "reset_token": "foobar@gmail.com",
            "new_password": "bar"
        }
        """
    )
    @api.expect(userForgetPasswordParser)
    def post(self):
        """ Resets the password for a user """
        data = request.get_json()
        reset_token = data.get('reset_token')
        new_password = data.get('new_password')

        with session_scope() as session:
            try:
                user = User.get_user_by_reset_token(session, reset_token)
                if not user:
                    return Response(
                        json.dumps({'message': 'Invalid reset token'}),
                        status=400, mimetype='application/json'
                    )

                if user.reset_token_expiry < datetime.now(timezone.utc):
                    return Response(
                        json.dumps({'message': 'Reset token expired'}),
                        status=400, mimetype='application/json'
                    )

                user.password = new_password
                user.reset_token = None
                user.reset_token_expiry = None

                return Response(
                    json.dumps({'message': 'Password successfully reset'}),
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

instructorForgetPasswordParser = api.parser()
instructorForgetPasswordParser.add_argument('email', type=str, help='Email', location='json', required=True)

class InstructorForgetPasswordEndpoint(Resource):
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
            "email": "foobar@gmail.com"
        }
        """
    )
    @api.expect(instructorForgetPasswordParser)
    def post(self):
        """ Initiates the password reset process for an instructor """
        data = request.get_json()
        email = data.get('email')
        
        with session_scope() as session:
            try:
                instructor = Instructor.get_user_by_email(session, email)
                # if not instructor:
                #     return Response(
                #         json.dumps({'message': 'Instructor not found'}),
                #         status=400, mimetype='application/json'
                #     )
                
                reset_token = secrets.token_urlsafe(32)
                if instructor:
                    instructor.reset_token = reset_token
                    instructor.reset_token_expiry = func.now() + timedelta(hours=1)

                # deep link using expo app scheme
                # com.musketeers.mobilearn
                reset_url = f"mobilearn://reset-password?token={reset_token}"

                qr_code_io = generate_qr_code(reset_url)

                msg = Message(
                    subject="Reset Password",
                    sender=MAIL_USERNAME,
                    recipients=[email],
                    html=generate_reset_email_html(reset_url)
                )

                msg.attach("qr.png", "image/png", qr_code_io.read(), "inline", {"Content-ID": "<qr_code>"})
                mail.send(msg)

                return Response(
                    json.dumps({'message': 'Password reset email sent'}),
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

instructorForgetPasswordParser = api.parser()
instructorForgetPasswordParser.add_argument('reset_token', type=str, help='Reset token', location='json', required=True)
instructorForgetPasswordParser.add_argument('new_password', type=str, help='New password', location='json', required=True)

class InstructorResetPasswordEndpoint(Resource):
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
            "reset_token": "scott_piper@edu.com",
            "new_password": "Scott_Piper2"
        }
        """
    )
    @api.expect(instructorForgetPasswordParser)
    def post(self):
        """ Resets the password for an instructor """
        data = request.get_json()
        reset_token = data.get('reset_token')
        new_password = data.get('new_password')

        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_reset_token(session, reset_token)
                if not instructor:
                    return Response(
                        json.dumps({'message': 'Invalid reset token'}),
                        status=400, mimetype='application/json'
                    )

                if instructor.reset_token_expiry < datetime.now(timezone.utc):
                    return Response(
                        json.dumps({'message': 'Reset token expired'}),
                        status=400, mimetype='application/json'
                    )

                instructor.password = new_password
                instructor.reset_token = None
                instructor.reset_token_expiry = None

                return Response(
                    json.dumps({'message': 'Password successfully reset'}),
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