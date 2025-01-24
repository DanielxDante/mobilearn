import json
from werkzeug.datastructures import FileStorage
from flask import Response, request
from flask_restx import Resource
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
from models.chapter import Chapter
from models.lesson import Lesson, LESSON
from services.course_services import CourseService
from services.chapter_services import ChapterService
from services.instructor_services import InstructorService
from utils.s3 import s3_client, allowed_file, bucket_name, cloudfront_domain, upload_file

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
                    'currency': course.currency,
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
        except Exception as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

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

            course_info = {
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
                    'lessons': sorted(
                        [lesson.to_dict(session, chapter.id) for lesson in chapter.lessons],
                        key=lambda x: x['order']
                    )
                } for chapter in course.chapters], key=lambda x: x['order']),
            }

            # Remove 'order' field from lessons
            for chapter in course_info['chapters']:
                for lesson in chapter['lessons']:
                    lesson.pop('order', None)
                    
            return Response(
                json.dumps(course_info),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

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

            return Response(
                json.dumps({'courses': courses_info}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()
    
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
                        'course_name': course.name,
                        'community_name': course.community.name,
                        'rating': str(course.rating),
                        'description': course.description,
                        'image': course.image_url,
                        'enrollment_count': len(course.user_enrollments),
                    } for course in courses if course.status == COURSE_STATUS.ACTIVE],
                    'not_approved_courses': [{
                        'id': course.id,
                        'course_name': course.name,
                        'community_name': course.community.name,
                        'rating': str(course.rating),
                        'description': course.description,
                        'image': course.image_url,
                        'enrollment_count': len(course.user_enrollments),
                    } for course in courses if course.status == COURSE_STATUS.NOT_APPROVED],
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

create_course_parser = api.parser()
# Course Fields
create_course_parser.add_argument('name', type=str, help='Name', location='form', required=True)
create_course_parser.add_argument('description', type=str, help='Description', location='form', required=True)
create_course_parser.add_argument('course_type', type=str, help='Course Type', location='form', required=True)
create_course_parser.add_argument('duration', type=str, help='Duration', location='form', required=True)
create_course_parser.add_argument('course_image', type=FileStorage, location='files', required=True)
create_course_parser.add_argument('price', type=float, help='Price', location='form', required=True)
create_course_parser.add_argument('difficulty', type=str, help='Difficulty', location='form', required=True)
create_course_parser.add_argument('skills', type=str, action='split', help='Skills', location='form', required=True)
# Specific Course Fields
create_course_parser.add_argument('school_name', type=str, help='School Name', location='form', required=False)
create_course_parser.add_argument('program_type', type=str, help='Program Type', location='form', required=False)
create_course_parser.add_argument('field', type=str, help='Field', location='form', required=False)
create_course_parser.add_argument('major', type=str, help='Major', location='form', required=False)
create_course_parser.add_argument('department', type=str, help='Department', location='form', required=False)
create_course_parser.add_argument('expertise', type=str, help='Expertise', location='form', required=False)
create_course_parser.add_argument('subject', type=str, help='Subject', location='form', required=False)
create_course_parser.add_argument('platform', type=str, help='Platform', location='form', required=False)
# Chapter and Lesson Structure and Files
create_course_parser.add_argument('content', type=str, help='Content', location='form', required=True)
# Ensure all filenames are unique
create_course_parser.add_argument('files', type=FileStorage, location='files', action='append')

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
        },
        description="""
            Fill in school_name, program_type, field, and major for academic courses.
            Fill in department and expertise for professional courses.
            Fill in subject for specialization courses.
            Fill in platform for project courses.
            Example content JSON string:

            {
                "chapters": [
                    {
                        "chapter_title": "Chapter 1",
                        "order": 1,
                        "lessons": [
                            {
                                "lesson_name": "Introduction",
                                "lesson_type": "text",
                                "order": 1,
                                "content": "{\"heading\": \"This is a text lesson...\"}"
                            },
                            {
                                "lesson_name": "Video Tutorial",
                                "lesson_type": "video",
                                "order": 2,
                                "video_key": "video1.mp4"
                            },
                            {
                                "lesson_name": "Assignment",
                                "lesson_type": "homework",
                                "order": 3,
                                "homework_key": "assignment1.pdf"
                            }
                        ]
                    }
                ]
            }
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
        content = json.loads(data.get('content'))

        optional_course_data = {
            'duration': round(float(data.get('duration')), 1),
            'price': round(float(data.get('price')), 2),
            'currency': data.get('currency', 'SGD'),
            'difficulty': data.get('difficulty'),
            'skills': data.getlist('skills'),
            'school_name': data.get('school_name', None),
            'program_type': data.get('program_type', None),
            'field': data.get('field', None),
            'major': data.get('major', None),
            'department': data.get('department', None),
            'subject': data.get('subject', None),
            'platform': data.get('platform', None)
        }
        
        files = request.files.getlist('files')
        filemap = {f.filename: f for f in files if f.filename}

        instructor_email = get_jwt_identity()

        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_email(session, instructor_email)
                if not instructor:
                    return Response(
                        json.dumps({"error": "Instructor not found"}),
                        status=400, mimetype='application/json'
                    )

                community_name = instructor.company
                community = Community.get_community_by_name(session, community_name)
                if not community:
                    return Response(
                        json.dumps({"error": "The community is not found"}),
                        status=400, mimetype='application/json'
                    )

                # Add course
                optional_course_data = {k: v for k, v in optional_course_data.items() if v is not None}
                course = Course.add_course(
                    session,
                    community_id=community.id,
                    name=name,
                    description=description,
                    course_type=course_type,
                    **optional_course_data
                )

                course_image = request.files.get('course_image')
                if not course_image or not allowed_file(course_image.filename):
                    return Response(
                        json.dumps({"error": "Invalid or missing course image file"}),
                        status=400, mimetype='application/json'
                    )

                course_image_url = upload_file(course_image, f"course_{str(course.id)}")
                course.image_url = course_image_url
                instructor.courses.append(course)

                # Add chapter
                for chapter_data in content['chapters']:
                    chapter = Chapter.add_chapter(
                        session,
                        course_id=course.id,
                        title=chapter_data['chapter_title'],
                        order=chapter_data['order']
                    )

                    # Add lesson
                    for lesson_data in chapter_data['lessons']:
                        lesson = Lesson.add_lesson(
                            session,
                            name=lesson_data['lesson_name'],
                            lesson_type=lesson_data['lesson_type'],
                        )

                        if lesson.lesson_type == LESSON.TEXT:
                            content = lesson_data['content']
                            lesson.content = content
                        elif lesson.lesson_type == LESSON.VIDEO:
                            video_file = filemap.get(lesson_data['video_key'])
                            if video_file:
                                video_url = upload_file(video_file, f"lesson_{str(lesson.id)}")
                                lesson.video_url = video_url
                            else:
                                return Response(
                                    json.dumps({"message": f"File {lesson_data['video_key']} not found"}),
                                    status=400, mimetype='application/json'
                                )
                        elif lesson.lesson_type == LESSON.HOMEWORK:
                            homework_file = filemap.get(lesson_data['homework_key'])
                            if homework_file:
                                homework_url = upload_file(homework_file, f"lesson_{str(lesson.id)}")
                                lesson.homework_url = homework_url
                            else:
                                return Response(
                                    json.dumps({"message": f"File {lesson_data['homework_key']} not found"}),
                                    status=400, mimetype='application/json'
                                )
                        else:
                            return Response(
                                json.dumps({"message": "Invalid lesson type"}),
                                status=400, mimetype='application/json'
                            )
                        
                        ChapterService.attach_lesson(session, chapter.id, lesson.id, lesson_data['order'])

                # Send a notification to the admin for approval
                # This can be done through a notification service or email

                return Response(
                    json.dumps({'message': f'Course successfully created'}),
                    status=200, mimetype="application/json"
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as e:
                return Response(
                    json.dumps({"error": str(e)}),
                    status=500, mimetype='application/json'
                )

class RetrieveCourseDetailsEndpoint(Resource):
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
    )
    @jwt_required()
    def get(self, course_id):
        """ Retrieve course details for editing """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            course = Course.get_course_by_id(session, course_id)
            if not course:
                return Response(
                    json.dumps({"error": "Course not found"}),
                    status=400, mimetype='application/json'
                )
            
            base_course_info = {
                'course_id': course.id,
                'community_id': course.community_id,
                'course_name': course.name,
                'description': course.description,
                'duration': str(course.duration),
                'image': course.image_url,
                'price': str(course.price),
                'currency': course.currency,
                'difficulty': course.difficulty,
                'skills': course.skills,
                'course_type': course.course_type,
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
                    'lessons': sorted(
                        [lesson.to_dict(session, chapter.id) for lesson in chapter.lessons],
                        key=lambda x: x['order']
                    )
                } for chapter in course.chapters], key=lambda x: x['order']),
            }

            # Remove 'order' field from lessons
            for chapter in base_course_info['chapters']:
                for lesson in chapter['lessons']:
                    lesson.pop('order', None)

            if course.course_type == 'academic':
                base_course_info['school_name'] = course.school_name
                base_course_info['program_type'] = course.program_type
                base_course_info['field'] = course.field
                base_course_info['major'] = course.major
            elif course.course_type == 'professional':
                base_course_info['department'] = course.department
                base_course_info['expertise'] = course.expertise
            elif course.course_type == 'specialization':
                base_course_info['subject'] = course.subject
            elif course.course_type == 'project':
                base_course_info['platform'] = course.platform
            
            return Response(
                json.dumps(base_course_info),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

edit_course_parser = api.parser()
# Course Fields
edit_course_parser.add_argument('course_id', type=int, help='Course ID', location='form', required=True)
edit_course_parser.add_argument('name', type=str, help='Name', location='form', required=True)
edit_course_parser.add_argument('description', type=str, help='Description', location='form', required=True)
edit_course_parser.add_argument('course_type', type=str, help='Course Type', location='form', required=True)
edit_course_parser.add_argument('duration', type=str, help='Duration', location='form', required=True)
edit_course_parser.add_argument('course_image', type=FileStorage, location='files', required=True)
edit_course_parser.add_argument('price', type=float, help='Price', location='form', required=True)
edit_course_parser.add_argument('difficulty', type=str, help='Difficulty', location='form', required=True)
edit_course_parser.add_argument('skills', type=str, action='split', help='Skills', location='form', required=True)
# Specific Course Fields
edit_course_parser.add_argument('school_name', type=str, help='School Name', location='form', required=False)
edit_course_parser.add_argument('program_type', type=str, help='Program Type', location='form', required=False)
edit_course_parser.add_argument('field', type=str, help='Field', location='form', required=False)
edit_course_parser.add_argument('major', type=str, help='Major', location='form', required=False)
edit_course_parser.add_argument('department', type=str, help='Department', location='form', required=False)
edit_course_parser.add_argument('subject', type=str, help='Subject', location='form', required=False)
edit_course_parser.add_argument('platform', type=str, help='Platform', location='form', required=False)
# Chapter and Lesson Structure and Files
edit_course_parser.add_argument('content', type=str, help='Content', location='form', required=True)
# Ensure all filenames are unique
edit_course_parser.add_argument('files', type=FileStorage, location='files', action='append')

class EditCourseEndpoint(Resource):
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
        },
        description="""

            """
    )
    @api.expect(edit_course_parser)
    @jwt_required()
    def post(self):
        """ Edit a course """
        data = request.form
        course_id = data.get('course_id')
        name = data.get('name')
        description = data.get('description')
        course_type = data.get('course_type')
        content = json.loads(data.get('content'))

        optional_course_data = {
            'duration': round(float(data.get('duration')), 1),
            'price': round(float(data.get('price')), 2),
            'currency': data.get('currency', 'SGD'),
            'difficulty': data.get('difficulty'),
            'skills': data.getlist('skills'),
            'school_name': data.get('school_name', None),
            'program_type': data.get('program_type', None),
            'field': data.get('field', None),
            'major': data.get('major', None),
            'department': data.get('department', None),
            'subject': data.get('subject', None),
            'platform': data.get('platform', None)
        }

        files = request.files.getlist('files')
        filemap = {f.filename: f for f in files if f.filename}

        instructor_email = get_jwt_identity()

        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_email(session, instructor_email)
                if not instructor:
                    return Response(
                        json.dumps({"error": "Instructor not found"}),
                        status=400, mimetype='application/json'
                    )

                course = Course.admin_get_course_by_id(session, course_id)
                if not course:
                    return Response(
                        json.dumps({"error": "Course not found"}),
                        status=400, mimetype='application/json'
                    )
                
                if course not in instructor.courses:
                    return Response(
                        json.dumps({"error": "Instructor is not offering this course"}),
                        status=400, mimetype='application/json'
                    )
                
                course_image = request.files.get('course_image')
                if course_image and allowed_file(course_image.filename):
                    course_image_url = upload_file(course_image, f"course_{str(course.id)}")
                    Course.change_image_url(session, course.id, course_image_url)

                # Edit course details
                Course.change_name(session, course.id, name)
                Course.change_description(session, course.id, description)
                Course.change_duration(session, course.id, optional_course_data['duration'])
                Course.change_price(session, course.id, optional_course_data['price'])
                Course.change_difficulty(session, course.id, optional_course_data['difficulty'])
                Course.change_skills(session, course.id, optional_course_data['skills'])
                Course.change_course_type(
                    session,
                    course.id,
                    course_type,
                    **optional_course_data
                )

                # Edit chapter and lesson structure
                for chapter_data in content['chapters']:
                    if 'chapter_id' in chapter_data: # edit/reorder existing chapter
                        chapter = Chapter.get_chapter_by_id(session, chapter_data['chapter_id'])
                        if not chapter:
                            raise ValueError("Chapter not found")
                        
                        Chapter.change_title(session, chapter.id, chapter_data['chapter_title'])
                        Chapter.change_order(session, chapter.id, chapter_data['order'])
                    else: # add new chapter
                        chapter = Chapter.add_chapter(
                            session,
                            course_id=course.id,
                            title=chapter_data['chapter_title'],
                            order=chapter_data['order']
                        )

                    lesson_ids = [lesson.id for lesson in chapter.lessons]

                    for lesson_data in chapter_data['lessons']:
                        if 'lesson_id' in lesson_data: # edit/reorder existing lesson
                            lesson_ids.remove(lesson_data['lesson_id'])

                            ChapterService.detach_lesson(session, chapter.id, lesson_data['lesson_id'])

                            lesson = Lesson.get_lesson_by_id(session, lesson_data['lesson_id'])
                            if not lesson:
                                raise ValueError("Lesson not found")
                            
                            Lesson.change_name(session, lesson.id, lesson_data['lesson_name'])
                            Lesson.change_lesson_type(session, lesson.id, lesson_data['lesson_type'], **lesson_data)
                        else: # add new lesson
                            lesson = Lesson.add_lesson(
                                session,
                                name=lesson_data['lesson_name'],
                                lesson_type=lesson_data['lesson_type'],
                            )

                        if lesson_data["lesson_type"] == LESSON.TEXT:
                            content = lesson_data['content']
                            lesson.content = content
                        elif lesson_data["lesson_type"] == LESSON.VIDEO:
                            video_file = filemap.get(lesson_data['video_key'])
                            if video_file:
                                video_url = upload_file(video_file, f"lesson_{str(lesson.id)}")
                                lesson.video_url = video_url
                        elif lesson_data["lesson_type"] == LESSON.HOMEWORK:
                            homework_file = filemap.get(lesson_data['homework_key'])
                            if homework_file:
                                homework_url = upload_file(homework_file, f"lesson_{str(lesson.id)}")
                                lesson.homework_url = homework_url
                        else:
                            return Response(
                                json.dumps({"message": "Invalid lesson type"}),
                                status=400, mimetype='application/json'
                            )
                        
                        ChapterService.attach_lesson(session, chapter.id, lesson.id, lesson_data['order'])
                    
                    # delete remaining lessons that are not included in the edited chapter
                    for lesson_id in lesson_ids:
                        lesson = Lesson.get_lesson_by_id(session, lesson_id)
                        if not lesson:
                            raise ValueError("Lesson not found")
                        
                        Lesson.delete_lesson(session, lesson.id)

                return Response(
                    json.dumps({'message': 'Course successfully edited'}),
                    status=200, mimetype="application/json"
                )

            except ValueError as ee:
                print(str(ee))
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as e:
                print(str(e))
                return Response(
                    json.dumps({"error": str(e)}),
                    status=500, mimetype='application/json'
                )



