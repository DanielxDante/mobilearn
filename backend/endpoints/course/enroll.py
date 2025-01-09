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
from services.instructor_services import InstructorService
from services.course_services import CourseService

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
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of courses per page',
                'required': False
            }
        },
    )
    @jwt_required()
    def get(self, channel_id):
        """ Get courses the user is enrolled in """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = UserService.get_user_enrolled_courses(
                session,
                user_email=current_email,
                channel_id=channel_id,
                page=page,
                per_page=per_page
            )
            course_info = [{
                'id': course.id,
                'course_name': course.name,
                'rating': str(course.rating),
                'description': course.description,
                'course_image': course.image_url,
                'community_name': course.community.name,
                'progress': float(CourseService.calculate_course_progress(
                    session,
                    current_email,
                    course.id
                ))
            } for course in courses]

            return Response(
                json.dumps({'courses': course_info}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({"error": str(e)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

class GetUserTopEnrolledCoursesEndpoint(Resource):
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
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of courses per page',
                'required': False
            }
        },
    )
    @jwt_required()
    def get(self, channel_id):
        """ Get top enrolled courses for users """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = UserService.get_top_enrolled_courses(
                session,
                user_email=current_email,
                channel_id=channel_id,
                page=page,
                per_page=per_page
            )
            course_info = [{
                'id': course.id,
                'course_name': course.name,
                'rating': str(course.rating),
                'course_image': course.image_url,
                'community_name': course.community.name,
            } for course in courses]

            return Response(
                json.dumps({'courses': course_info}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({"error": str(e)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()
    
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

class GetInstructorTopEnrolledCoursesEndpoint(Resource):
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
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of courses per page',
                'required': False
            }
        },
    )
    @jwt_required()
    def get(self):
        """ Get top enrolled courses for instructors """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = InstructorService.get_top_enrolled_courses(
                session,
                instructor_email=current_email,
                page=page,
                per_page=per_page
            )
            course_info = [{
                'id': course.id,
                'course_name': course.name,
                'rating': str(course.rating),
                'course_image': course.image_url,
                'community_name': course.community.name,
            } for course in courses]

            return Response(
                json.dumps({'courses': course_info}),
                status=200, mimetype='application/json'
            )    
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({"error": str(e)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()