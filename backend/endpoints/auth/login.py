import json
from flask import Response, request
from flask_restx import Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)
from sqlalchemy import func

from app import api
from database import session_scope, create_session
from models.user import User, STATUS
from models.instructor import Instructor

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

                # TODO: add user device token

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

                # TODO: add instructor device token
                
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