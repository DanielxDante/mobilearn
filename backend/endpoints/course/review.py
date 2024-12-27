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

class GetUserCourseReviewEndpoint(Resource):
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
        """ Get the review of the course made by the user """
        current_email = get_jwt_identity()

        session = create_session()

        try:
            review = UserService.get_user_course_review(session, current_email, course_id)
            if not review:
                return Response(
                    json.dumps({
                        'rating': 0,
                        'review_text': ""
                    }),
                    status=200, mimetype='application/json'
                )
            return Response(
                json.dumps({
                    'rating': review.rating,
                    'review_text': review.review_text
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )

save_review_parser = api.parser()
save_review_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)
save_review_parser.add_argument('rating', type=int, help='Rating', location='json', required=True)
save_review_parser.add_argument('review_text', type=str, help='Review Text', location='json', required=True)

class SaveReviewEndpoint(Resource):
    @api.doc(
        responses={
            201: 'Created',
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
                "course_id": 1,
                "rating": 4,
                "review_text": "Great course!"
            }
            """
    )
    @api.expect(save_review_parser)
    @jwt_required()
    def post(self):
        """ Edit and save a review for the course """
        data = request.json
        course_id = data.get('course_id')
        rating = data.get('rating')
        review_text = data.get('review_text')

        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                if UserService.get_user_course_review(session, current_email, course_id):
                    UserService.edit_review(
                        session,
                        user_email=current_email,
                        course_id=course_id,
                        new_rating=rating,
                        new_review_text=review_text
                    )
                else:
                    UserService.create_review(
                        session,
                        user_email=current_email,
                        course_id=course_id,
                        rating=rating,
                        review_text=review_text
                    )
                return Response(
                    json.dumps({'message': 'Review successfully created'}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=500, mimetype='application/json'
                )