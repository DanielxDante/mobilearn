import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from services.course_services import CourseService

class GetRecommendedCoursesEndpoint(Resource):
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
        """ Get recommended courses for the user """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = CourseService.get_recommended_courses(
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
                json.dumps(course_info),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
