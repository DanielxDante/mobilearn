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
from models.course import Course
from models.lesson import Lesson
from services.lesson_services import LessonService
from utils.s3 import upload_file, allowed_file

class GetLessonDetailsEndpoint(Resource):
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
    def get(self, lesson_id):
        """ Get lesson details for users """
        user_email = get_jwt_identity()

        session = create_session()

        try:
            lesson = Lesson.get_lesson_by_id(session, lesson_id)
            if not lesson:
                raise ValueError("Lesson not found")
            
            lesson_data = {
                'id': lesson.id,
                'name': lesson.name,
                'lesson_type': lesson.lesson_type,
            }

            if lesson.lesson_type == 'text':
                lesson_data['content'] = lesson.content
            elif lesson.lesson_type == 'video':
                lesson_data['video_url'] = lesson.video_url
            elif lesson.lesson_type == 'homework':
                lesson_data['homework_url'] = lesson.homework_url
                homework_submission = LessonService.get_homework_submission(
                    session,
                    user_email=user_email,
                    homework_lesson_id=lesson.id
                )
                lesson_data['submission_url'] = homework_submission.homework_submission_file_url if homework_submission else ""

            return Response(
                json.dumps(lesson_data),
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

class PreviewLessonEndpoint(Resource):
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
    def get(self, lesson_id):
        """ Preview lesson content for instructors """
        instructor_email = get_jwt_identity()

        session = create_session()

        try:
            lesson = Lesson.get_lesson_by_id(session, lesson_id)
            if not lesson:
                raise ValueError("Lesson not found")
            
            lesson_data = {
                'id': lesson.id,
                'name': lesson.name,
                'lesson_type': lesson.lesson_type,
            }

            if lesson.lesson_type == 'text':
                lesson_data['content'] = lesson.content
            elif lesson.lesson_type == 'video':
                lesson_data['video_url'] = lesson.video_url
            elif lesson.lesson_type == 'homework':
                lesson_data['homework_url'] = lesson.homework_url

            return Response(
                json.dumps(lesson_data),
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

complete_lesson_parser = api.parser()
complete_lesson_parser.add_argument('lesson_id', type=int, help='Lesson ID', location='json', required=True)

class CompleteLessonEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad Request',
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
                "lesson_id": 1
            }
            """
    )
    @api.expect(complete_lesson_parser)
    @jwt_required()
    def post(self):
        """ Add record of text or video lesson completion for the user """
        data = request.json
        lesson_id = data.get('lesson_id')

        user_email = get_jwt_identity()

        with session_scope() as session:
            try:
                LessonService.complete_lesson(
                    session,
                    user_email=user_email,
                    lesson_id=lesson_id
                )

                return Response(
                    json.dumps({"message": "Lesson completed"}),
                    status=200, mimetype='application/json'
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

submit_homework_parser = api.parser()
submit_homework_parser.add_argument('homework_lesson_id', type=int, help='Homework Lesson ID', location='form', required=True)
submit_homework_parser.add_argument(
    'homework_submission_file',
    type=FileStorage,
    help='Homework Submission File',
    location='files',
    required=True
)

class SubmitHomeworkEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad Request',
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
    @api.expect(submit_homework_parser)
    @jwt_required()
    def post(self):
        """ Submit homework and complete the homework lesson """
        data = request.form
        homework_lesson_id = data.get('homework_lesson_id')
        homework_submission_file = request.files.get('homework_submission_file')
        if not homework_submission_file or not allowed_file(homework_submission_file.filename):
            return Response(
                json.dumps({"error": "Invalid homework submission file"}),
                status=400, mimetype='application/json'
            )

        user_email = get_jwt_identity()

        with session_scope() as session:
            try:
                lesson = Lesson.get_lesson_by_id(session, homework_lesson_id)
                if not lesson:
                    raise ValueError("Lesson not found")
                if lesson.lesson_type != 'homework':
                    raise ValueError("Lesson is not a homework lesson")
                
                homework_submission_file_url = upload_file(homework_submission_file, f'homework_{str(lesson.id)}')

                LessonService.submit_homework(
                    session,
                    user_email=user_email,
                    lesson_id=lesson.id,
                    homework_submission_file_url=homework_submission_file_url
                )

                return Response(
                    json.dumps({"message": "Homework submitted"}),
                    status=200, mimetype='application/json'
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
        