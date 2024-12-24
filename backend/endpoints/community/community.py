import json
from botocore.exceptions import ClientError
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from models.community import Community

class GetCommunitiesEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        }
    )
    def get(self):
        """ Get all communities for instructor sign up """
        session = create_session()

        try:
            communities = Community.get_communities(session)
            communities_info = [{
                'name': community.name,
                'community_type': community.community_type,
                'community_logo_url': community.community_logo_url
            } for community in communities]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'communities': communities_info}),
            status=200, mimetype='application/json'
        )

