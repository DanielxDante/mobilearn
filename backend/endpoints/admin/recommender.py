import json
from flask import Response, request
from flask_restx import Resource

from app import api, app
from database import session_scope, create_session
from utils.admin_decorator import require_admin_key

change_user_status_parser = api.parser()
change_user_status_parser.add_argument('recommendation_type', type=str, help='New Recommendation Type', location='json', required=True)

class ChangeRecommendationTypeEndpoint(Resource):
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
                "recommendation_type": "collaborative"
            }
            """
    )
    @api.expect(change_user_status_parser)
    @require_admin_key
    def post(self):
        """ Change recommendation type """
        data = request.get_json()
        recommendation_type = data.get('recommendation_type')

        if not recommendation_type or recommendation_type not in ['content', 'collaborative']:
            return Response(
                json.dumps({'message': 'Invalid recommendation type'}),
                status=400, mimetype='application/json'
            )
        
        app.config['RECOMMENDATION_TYPE'] = recommendation_type

        return Response(
            json.dumps({'message': '(Admin) Recommendation type changed successfully'}),
            status=200, mimetype='application/json'
        )