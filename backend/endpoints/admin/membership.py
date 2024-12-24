import json
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from models.user import User, MEMBERSHIP
from utils.admin_decorator import require_admin_key

change_user_status_parser = api.parser()
change_user_status_parser.add_argument('user_email', type=str, help='User Email', location='json', required=True)
change_user_status_parser.add_argument(
    'new_membership',
    type=str,
    help='New Membership',
    location='json',
    required=True,
    choices=MEMBERSHIP.values()
)

class ChangeUserMembershipEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            403: 'Forbidden',
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
                "user_email": "foobar@gmail.com",
                "new_membership": "member"
            }
            """
    )
    @api.expect(change_user_status_parser)
    @require_admin_key
    def post(self):
        """ Change user membership """
        data = request.get_json()
        email = data.get('user_email')
        new_membership = data.get('new_membership')
        
        with session_scope() as session:
            try:
                User.change_membership(session, email, new_membership)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': '(Admin) User membership changed successfully'}),
            status=200, mimetype='application/json'
        )
