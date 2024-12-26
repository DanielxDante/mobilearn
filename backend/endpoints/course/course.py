import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from models.course import Course
from services.course_services import CourseService

class GetUserCoursesEndpoint(Resource):
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
        """ Get courses the user can get access to """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = CourseService.get_user_courses(session, current_email)
            courses_info = [{
                'id': course.id,
                'name': course.name,
                'description': course.description,
                'image': course.image
            } for course in courses]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'courses': courses_info}),
            status=200, mimetype='application/json'
        )
    
class GetInstructorCoursesEndpoint(Resource):
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
        """ Get courses the instructor is teaching """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = CourseService.get_instructor_courses(session, current_email)
            courses_info = [{
                'id': course.id,
                'name': course.name,
                'description': course.description,
                'image': course.image
            } for course in courses]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'courses': courses_info}),
            status=200, mimetype='application/json'
        )

parser = api.parser()
parser.add_argument('name', type=str, help='name', location='json', required=True)
parser.add_argument('school', type=str, help='School', location='json', required=True)
parser.add_argument('description', type=str, help='Description', location='json')
parser.add_argument('image', type=str, help='Image', location='json')

class CreateCourseEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        description="""
            Example request JSON:
            
            {
                'name': course.name, 
                'school': course.school,      
                'description': course.description,
                'image': course.image,
            }
            """
    )

    @api.expect(parser)
    def post(self):
        data = request.get_json()
        name = data.get('name')
        school = data.get('school')
        description = data.get('description')
        image = data.get('image')

        Course.add_course(name, school, description, image)

        return Response(
            json.dumps({'message': f'Course ({name}) created'}),
            status=200, mimetype="application/json"
        )
