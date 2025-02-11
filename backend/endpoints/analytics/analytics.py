import json
from flask import Response
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from services.analytics_services import AnalyticsService

class GetInstructorTotalLessons(Resource):
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
        """
        Get total number of lessons taught by an instructor
        """
        instructor_email = get_jwt_identity()
        
        session = create_session()

        try:
            total_lessons = AnalyticsService.get_instructor_total_lessons(session, instructor_email)

            return Response(
                json.dumps({"total_lessons": total_lessons}),
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
    
class GetInstructorTotalEnrollments(Resource):
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
    def get(self, time_range="month"):
        """
        Get total number of enrollments in courses taught by an instructor
        """
        instructor_email = get_jwt_identity()
        
        session = create_session()

        try:
            total_enrollments, percentage_change = AnalyticsService.get_instructor_total_enrollments(
                session,
                instructor_email,
                time_range=time_range
            )

            return Response(
                json.dumps({"total_enrollments": total_enrollments, "percentage_change": percentage_change}),
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

class GetInstructorTotalReviews(Resource):
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
    def get(self, time_range="month"):
        """
        Get total number of reviews in courses taught by an instructor
        """
        instructor_email = get_jwt_identity()
        
        session = create_session()

        try:
            total_reviews, percentage_change = AnalyticsService.get_instructor_total_reviews(
                session,
                instructor_email,
                time_range=time_range
            )

            return Response(
                json.dumps({"total_reviews": total_reviews, "percentage_change": percentage_change}),
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

class GetInstructorAverageCourseProgress(Resource):
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
    def get(self, time_range="month"):
        """
        Get average course completion rate in courses taught by an instructor
        """
        instructor_email = get_jwt_identity()
        
        session = create_session()

        try:
            average_course_progress, percentage_change = AnalyticsService.get_instructor_average_course_progress(
                session,
                instructor_email,
                time_range=time_range
            )

            return Response(
                json.dumps({
                    "average_course_progress": average_course_progress,
                    "percentage_change": percentage_change
                }),
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