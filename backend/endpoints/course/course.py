import os
import json
from botocore.exceptions import ClientError
from flask import Response, request
from flask_restx import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from models.course import Course, STATUS as COURSE_STATUS
from models.enrollment import Enrollment
from models.instructor import Instructor
from models.community import Community
from services.course_services import CourseService
from services.instructor_services import InstructorService
from utils.s3 import s3_client, allowed_file, bucket_name, cloudfront_domain

class GetUnenrolledCourseEndpoint(Resource):
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
    def get(self, course_id):
        """ Get course info for enrollment """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            course = Course.get_course_by_id(session, course_id)
            return Response(
                json.dumps({
                    'course_id': course.id,
                    'community_id': course.community_id,
                    'course_image': course.image_url,
                    'course_name': course.name,
                    'community_name': course.community.name,
                    'enrollment_count': len(course.user_enrollments),
                    'price': str(course.price),
                    'description': course.description,
                    'lesson_count': str(sum(len(chapter.lessons) for chapter in course.chapters)),
                    'duration': str(course.duration),
                    'skills': course.skills,
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )

class GetEnrolledCourseEndpoint(Resource):
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
    def get(self, course_id):
        """ Get course info for enrolled users/instructors that created the course """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            course = Course.get_course_by_id(session, course_id)
            return Response(
                json.dumps({
                    'course_id': course.id,
                    'community_id': course.community_id,
                    'course_image': course.image_url,
                    'course_name': course.name,
                    'community_name': course.community.name,
                    'description': course.description,
                    'instructors': [{
                        'instructor_id': instructor.id,
                        'instructor_name': instructor.name,
                        'instructor_profile_picture': instructor.profile_picture_url,
                        'instructor_position': instructor.position,
                    } for instructor in course.instructors],
                    'chapters': sorted([{
                        'chapter_id': chapter.id,
                        'chapter_title': chapter.title,
                        'order': chapter.order,
                        'lessons': [{
                            'lesson_id': lesson.id,
                            'lesson_name': lesson.name,
                        } for lesson in chapter.lessons]
                    } for chapter in course.chapters], key=lambda x: x['chapter_id']),
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )

class SearchCoursesEndpoint(Resource):
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
            'search_term': {
                'in': 'query',
                'description': 'Search term for courses',
                'required': False
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
        """ Get all courses in a channel """
        search_term = request.args.get('search_term', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 5))

        current_email = get_jwt_identity()

        session = create_session()

        try:
            courses = CourseService.get_channel_courses(
                session,
                channel_id=channel_id,
                search_term=search_term,
                page=page,
                per_page=per_page
            )
            courses_info = [{
                'id': course.id,
                'course_name': course.name,
                'rating': str(course.rating),
                'skills': course.skills,
                'course_image': course.image_url,
                'community_name': course.community.name,
                'community_logo': course.community.community_logo_url,
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
            courses = InstructorService.get_instructor_courses(session, current_email)
            return Response(
                json.dumps({
                    'active_courses': [{
                        'id': course.id,
                        'name': course.name,
                        'description': course.description,
                        'image': course.image_url
                    } for course in courses if course.status == COURSE_STATUS.ACTIVE],
                    'not_approved_courses': [{
                        'id': course.id,
                        'name': course.name,
                        'description': course.description,
                        'image': course.image_url
                    } for course in courses if course.status == COURSE_STATUS.NOT_APPROVED],
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )

create_course_parser = api.parser()
create_course_parser.add_argument('name', type=str, help='Name', location='form', required=True)
create_course_parser.add_argument('description', type=str, help='Description', location='form', required=True)
create_course_parser.add_argument('course_type', type=str, help='Course Type', location='form', required=True)
create_course_parser.add_argument('duration', type=str, help='Duration', location='form', required=True)
create_course_parser.add_argument('price', type=float, help='Price', location='form', required=True)
create_course_parser.add_argument('difficulty', type=str, help='Difficulty', location='form', required=True)
create_course_parser.add_argument('skills', type=str, action='split', help='Skills', location='form', required=True)
create_course_parser.add_argument('school_name', type=str, help='School Name', location='form', required=False)
create_course_parser.add_argument('program_type', type=str, help='Program Type', location='form', required=False)
create_course_parser.add_argument('field', type=str, help='Field', location='form', required=False)
create_course_parser.add_argument('major', type=str, help='Major', location='form', required=False)
create_course_parser.add_argument('department', type=str, help='Department', location='form', required=False)
create_course_parser.add_argument('subject', type=str, help='Subject', location='form', required=False)
create_course_parser.add_argument('platform', type=str, help='Platform', location='form', required=False)

class CreateCourseEndpoint(Resource):
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
            },
            'file': {
                'in': 'formData',
                'type': 'file',
                'description': 'The file to upload',
                'required': False
            }
        },
        description="""
            Fill in school_name, program_type, field, and major for academic courses.
            Fill in department for professional courses.
            Fill in subject for specialization courses.
            Fill in platform for project courses.
        """
    )
    @api.expect(create_course_parser)
    @jwt_required()
    def post(self):
        """ Create a course """
        data = request.form
        name = data.get('name')
        description = data.get('description')
        course_type = data.get('course_type')
        # other_instructors = data.get('other_instructors', None) # TODO: to clarify

        optional_course_data = {
            'duration': data.get('duration'),
            'price': data.get('price'),
            'difficulty': data.get('difficulty'),
            'skills': data.get('skills'),
            'school_name': data.get('school_name', None),
            'program_type': data.get('program_type', None),
            'field': data.get('field', None),
            'major': data.get('major', None),
            'department': data.get('department', None),
            'subject': data.get('subject', None),
            'platform': data.get('platform', None)
        }

        if 'file' not in request.files:
            return Response(
                json.dumps({'message': "No file part"}),
                status=400, mimetype='application/json'
            )
        
        file = request.files['file']
        
        if file.filename == '':
            return Response(
                json.dumps({'message': "No selected file"}),
                status=400, mimetype='application/json'
            )
        
        if not allowed_file(file.filename):
            return Response(
                json.dumps({'message': "Invalid file type"}),
                status=400, mimetype='application/json'
            )

        instructor_email = get_jwt_identity()

        with session_scope() as session:
            instructor = Instructor.get_instructor_by_email(session, instructor_email)
            if not instructor:
                return Response(
                    json.dumps({"error": "Instructor not found"}),
                    status=404, mimetype='application/json'
                )
            
            community_name = instructor.company
            community = Community.get_community_by_name(session, community_name)
            if not community:
                return Response(
                    json.dumps({"error": "The community is not found"}),
                    status=404, mimetype='application/json'
                )

            optional_course_data = {k: v for k, v in optional_course_data.items() if v is not None}

            course = Course.add_course(
                session,
                community_id=community.id,
                name=name,
                description=description,
                course_type=course_type,
                **optional_course_data
            )

            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"course_{str(course.id)}{file_extension}"

            try:
                base_filename = os.path.splitext(unique_filename)[0]
                response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=base_filename)
                if 'Contents' in response:
                    for obj in response['Contents']:
                        s3_client.delete_object(Bucket=bucket_name, Key=obj['Key'])
            except ClientError as e:
                if e.response['Error']['Code'] != '404':
                    raise

            s3_client.upload_fileobj(
                file,
                bucket_name,
                unique_filename,
                ExtraArgs={
                    'ContentType': file.content_type
                }
            )

            image_url = f"https://{cloudfront_domain}/{unique_filename}"
            course.image = image_url

            instructor.courses.append(course)

        return Response(
            json.dumps({'message': f'Course ({name}) created'}),
            status=200, mimetype="application/json"
        )

# edit_course_parser = api.parser()

# class EditCourseEndpoint(Resource):

# class CompleteLessonEndpoint(Resource):
