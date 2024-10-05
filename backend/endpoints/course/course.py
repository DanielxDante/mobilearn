import json
from flask_restx import Resource, Namespace
from flask import Response, request, jsonify

from app import api
from models.course import Course

parser = api.parser()
parser.add_argument('name', type=str, help='name', location='json', required=True)
parser.add_argument('school', type=str, help='School', location='json', required=True)
parser.add_argument('description', type=str, help='Description', location='json')
parser.add_argument('image', type=str, help='Image', location='json')

class CourseEndpoint(Resource):
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

    def get_courses(self):
        courses = Course.get_courses()
        response_data = [{
            'id': course.id,
            'name': course.name, 
            'school': course.school,      
            'description': course.description, 
            'rating': course.rating,
            'completionRate': course.completionRate, 
            'image': course.image,
            'enrolledCount': course.enrolledCount,
            'created_on': course.created_on
        } for course in courses]

        return Response(
            response = jsonify(response_data),
            status = 200,
            mimetype='application/json'
        )