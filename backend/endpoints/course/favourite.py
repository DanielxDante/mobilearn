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

class GetFavouriteCoursesEndpoint(Resource):
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
        """ Get the user's favourite courses """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                courses = UserService.get_user_favourite_courses(
                    session,
                    user_email=current_email,
                    channel_id=channel_id,
                    page=page,
                    per_page=per_page
                )
                course_info = [{
                    'id': course.id,
                    'course_name': course.name,
                    'description': course.description,
                    'rating': str(course.rating),
                    'course_image': course.image_url,
                    'community_name': course.community.name,
                    'enrollments': int(len(course.user_enrollments) if course.user_enrollments else 0),
                } for course in courses]

                return Response(
                    json.dumps(course_info),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=404, mimetype='application/json'
                )

add_favourite_course_parser = api.parser()
add_favourite_course_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)
class AddFavouriteCourseEndpoint(Resource):
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
        },
    )
    @api.expect(add_favourite_course_parser)
    @jwt_required()
    def post(self):
        """ Add a course to the user's favourite courses """
        data = request.json
        course_id = data.get('course_id')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                UserService.add_favourite_course(
                    session,
                    user_email=current_email,
                    course_id=course_id
                )
                return Response(
                    json.dumps({"message": "Course successfully added to favourites"}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )

remove_favourite_course_parser = api.parser()
remove_favourite_course_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)
class RemoveFavouriteCourseEndpoint(Resource):
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
        },
    )
    @api.expect(remove_favourite_course_parser)
    @jwt_required()
    def post(self):
        """ Remove a course from the user's favourite courses """
        data = request.json
        course_id = data.get('course_id')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                UserService.remove_favourite_course(
                    session,
                    user_email=current_email,
                    course_id=course_id
                )
                return Response(
                    json.dumps({"message": "Course successfully removed from favourites"}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )
