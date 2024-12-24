import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    get_jwt,
    decode_token,
    jwt_required,
    get_jwt_identity,
    create_access_token,
    create_refresh_token
)

from app import api
from database import session_scope, create_session
from models.user import User
from models.instructor import Instructor
from models.token import TokenBlocklist

change_user_email_parser = api.parser()
change_user_email_parser.add_argument(
    'new_email',
    type=str,
    help='New Email',
    location='json',
    required=True
)
change_user_email_parser.add_argument(
    'refresh_token',
    type=str,
    help='Refresh Token',
    location='json',
    required=True
)

class ChangeUserEmailEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "new_email": "foo2@gmail.com",
                "refresh_token": "Bearer ..."
            }
            """
    )
    @api.expect(change_user_email_parser)
    @jwt_required()
    def post(self):
        """ Change user email """
        data = request.get_json()
        new_email = data.get('new_email')
        old_refresh_token = data.get('refresh_token').replace("Bearer ", "").strip()

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                access_jti = get_jwt()['jti']
                refresh_jti = decode_token(old_refresh_token)["jti"]

                TokenBlocklist.add_token(session, access_jti, "access")
                TokenBlocklist.add_token(session, refresh_jti, "refresh")

                User.change_email(session, current_email, new_email)
                new_access_token = create_access_token(identity=new_email)
                new_refresh_token = create_refresh_token(identity=new_email)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({
                'access_token': f"Bearer {new_access_token}",
                'refresh_token': f"Bearer {new_refresh_token}"
            }),
            status=200, mimetype='application/json'
        )
    
change_user_password_parser = api.parser()
change_user_password_parser.add_argument(
    'old_password',
    type=str,
    help='Old Password',
    location='json',
    required=True
)
change_user_password_parser.add_argument(
    'new_password',
    type=str,
    help='New Password',
    location='json',
    required=True
)

class ChangeUserPasswordEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "old_password": "bar",
                "new_password": "bar2"
            }
            """
    )
    @api.expect(change_user_password_parser)
    @jwt_required()
    def post(self):
        """ Change user password """
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                User.change_password(session, current_email, old_password, new_password)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        
        return Response(
            json.dumps({'message': 'User password changed successfully'}),
            status=200, mimetype='application/json'
        )

change_instructor_email_parser = api.parser()
change_instructor_email_parser.add_argument(
    'new_email',
    type=str,
    help='New Email',
    location='json',
    required=True
)
change_instructor_email_parser.add_argument(
    'refresh_token',
    type=str,
    help='Refresh Token',
    location='json',
    required=True
)

class ChangeInstructorEmailEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "new_email": "foo2@e.ntu.edu.sg",
                "refresh_token": "Bearer ..."
            }
            """
    )
    @api.expect(change_instructor_email_parser)
    @jwt_required()
    def post(self):
        """ Change instructor email """
        data = request.get_json()
        new_email = data.get('new_email')
        old_refresh_token = data.get('refresh_token').replace("Bearer ", "").strip()

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                access_jti = get_jwt()['jti']
                refresh_jti = decode_token(old_refresh_token)["jti"]

                TokenBlocklist.add_token(session, access_jti, "access")
                TokenBlocklist.add_token(session, refresh_jti, "refresh")

                Instructor.change_email(session, current_email, new_email)
                new_access_token = create_access_token(identity=new_email)
                new_refresh_token = create_refresh_token(identity=new_email)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({
                'access_token': f"Bearer {new_access_token}",
                'refresh_token': f"Bearer {new_refresh_token}"
            }),
            status=200, mimetype='application/json'
        )

change_instructor_password_parser = api.parser()
change_instructor_password_parser.add_argument(
    'old_password',
    type=str,
    help='Old Password',
    location='json',
    required=True
)
change_user_password_parser.add_argument(
    'new_password',
    type=str,
    help='New Password',
    location='json',
    required=True
)

class ChangeInstructorPasswordEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "old_password": "bar",
                "new_password": "bar2"
            }
            """
    )
    @api.expect(change_instructor_password_parser)
    @jwt_required()
    def post(self):
        """ Change instructor password """
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                Instructor.change_password(session, current_email, old_password, new_password)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        
        return Response(
            json.dumps({'message': 'Instructor password changed successfully'}),
            status=200, mimetype='application/json'
        )
    
change_instructor_company_parser = api.parser()
change_instructor_company_parser.add_argument(
    'new_company',
    type=str,
    help='New Company',
    location='json',
    required=True
)

class ChangeInstructorCompanyEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'Authorization': {
                'in': 'header',
                'description': 'Bearer token',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "new_company": "National University of Singapore",
            }
            """
    )
    @api.expect(change_instructor_company_parser)
    @jwt_required()
    def post(self):
        """ Change instructor company """
        data = request.get_json()
        new_company = data.get('new_company')

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                Instructor.change_company(session, current_email, new_company)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        
        return Response(
            json.dumps({'message': 'Instructor company changed successfully'}),
            status=200, mimetype='application/json'
        )