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
from models.instructor import Instructor
from services.community_services import CommunityService

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

class GetCommunityInstructorsEndpoint(Resource):
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
    def get(self, community_id: str):
        """ Get all instructors in a community """
        session = create_session()

        try:
            instructors = CommunityService.get_community_instructors(session, community_id)
            instructors_info = [{
                'id': instructor.id,
                'name': instructor.name,
                'profile_picture_url': instructor.profile_picture_url
            } for instructor in instructors]
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        return Response(
            json.dumps({'instructors': instructors_info}),
            status=200, mimetype='application/json'
        )

class GetInstructorDetailsEndpoint(Resource):
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
    def get(self, instructor_id: str):
        """ Get instructor details """
        session = create_session()

        try:
            instructor = Instructor.get_instructor_by_id(session, instructor_id)
            return Response(
                json.dumps({
                    'id': instructor.id,
                    'name': instructor.name,
                    'profile_picture_url': instructor.profile_picture_url,
                    'company': instructor.company,
                    'position': instructor.position,
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=404, mimetype='application/json'
            )
        
