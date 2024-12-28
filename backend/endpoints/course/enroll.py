import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from services.user_services import UserService

class GetUserEnrolledCoursesEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
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
    )
    @jwt_required()
    def get(self):
        """ Get courses the user is enrolled in """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = UserService.get_user_enrolled_courses(session, current_email)
            course_ids = [course.id for course in courses]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'courses': course_ids}),
            status=200, mimetype='application/json'
        )

# class GetTopEnrolledCoursesEndpoint(Resource):
    
enroll_user_parser = api.parser()
enroll_user_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)

class EnrollUserEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
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
                "course_id": 1
            }
            """
    )
    @api.expect(enroll_user_parser)
    @jwt_required()
    def post(self):
        """ Enroll the user in a course """
        data = request.json
        course_id = data.get('course_id')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                UserService.enroll_user(session, current_email, course_id)
                return Response(
                    json.dumps({"message": "User successfully enrolled"}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )

withdraw_user_parser = api.parser()
withdraw_user_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)

class WithdrawUserEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
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
                "course_id": 1
            }
            """
    )
    @api.expect(withdraw_user_parser)
    @jwt_required()
    def post(self):
        """ Withdraw the user from a course """
        data = request.json
        course_id = data.get('course_id')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                UserService.withdraw_user(session, current_email, course_id)
                return Response(
                    json.dumps({"message": "User successfully withdrawn"}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )
           