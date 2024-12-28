import json
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from services.user_services import UserService
from utils.admin_decorator import require_admin_key

enroll_user_parser = api.parser()
enroll_user_parser.add_argument('course_id', type=int, help='Course ID', location='json', required=True)
enroll_user_parser.add_argument('user_email', type=str, help='User Email', location='json', required=True)

class EnrollUserEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            }
        },
        description="""
            Example request JSON:

            {
                "user_email": "foo@gmail.com",
                "course_id": 1
            }
            """
    )
    @api.expect(enroll_user_parser)
    def post(self):
        """ Force enroll the user in a course """
        data = request.json
        user_email = data.get('user_email')
        course_id = data.get('course_id')

        with session_scope() as session:
            try:
                UserService.enroll_user(session, user_email, course_id)
                return Response(
                    json.dumps({"message": "(Admin) User successfully enrolled"}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({"error": str(ee)}),
                    status=400, mimetype='application/json'
                )