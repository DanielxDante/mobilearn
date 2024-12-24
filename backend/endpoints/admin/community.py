import os
import json
from botocore.exceptions import ClientError
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from enums.community import COMMUNITY
from models.community import Community
from utils.admin_decorator import require_admin_key
from utils.s3 import s3_client, allowed_file, bucket_name, cloudfront_domain

create_community_parser = api.parser()
create_community_parser.add_argument(
    'community_type',
    type=str,
    help='Community Type',
    location='form',
    required=True,
    choices=[community.value for community in COMMUNITY]
)
create_community_parser.add_argument('name', type=str, help='Name', location='form', required=True)
create_community_parser.add_argument('description', type=str, help='Description', location='form', required=True)
create_community_parser.add_argument('website_url', type=str, help='Website URL', location='form', required=True)

class CreateCommunityEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            },
            'file': {
                'in': 'formData',
                'type': 'file',
                'description': 'Community logo',
                'required': False
            }
        },
        description="""
            Example request JSON:

            {
                "community_type": "university,
                "name": "Nanyang Technological University",
                "description": "Nanyang Technological University is a public research university in Singapore. Founded in 1981, it is also the second oldest autonomous university in the country.",
                "website_url": "https://www.ntu.edu.sg/"
            }
            """
    )
    @api.expect(create_community_parser)
    @require_admin_key
    def post(self):
        """ Create community """
        data = request.form
        community_type = data.get('community_type')
        name = data.get('name')
        description = data.get('description')
        website_url = data.get('website_url') 

        with session_scope() as session:
            try:
                community = Community.add_community(
                    session,
                    community_type,
                    name,
                    description,
                    website_url
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        
        if 'file' in request.files:
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
            
            with session_scope() as session:
                try:
                    file_extension = os.path.splitext(file.filename)[1]
                    unique_filename = f"community_{str(community.id)}{file_extension}"

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

                    Community.change_community_logo_url(session, community.id, image_url)
                except ClientError as e:
                    return Response(
                        json.dumps({'message': "Upload failed"}),
                        status=500, mimetype='application/json'
                    )
                except ValueError as ee:
                    return Response(
                        json.dumps({'message': str(ee)}),
                        status=400, mimetype='application/json'
                    )

        return Response(
            json.dumps({'community_id': community.id}),
            status=200, mimetype='application/json'
        )

attach_community_parser = api.parser()
attach_community_parser.add_argument('channel_id', type=str, help='Channel ID', location='json', required=True)
attach_community_parser.add_argument('community_ids', type=list, help='Community IDs', location='json', required=True, action='append')

class AttachCommunityToChannelEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params={
            'X-Admin-Key': {
                'in': 'header',
                'description': 'Admin key for running admin apis',
                'required': True
            },
        },
        description="""
            Example request JSON:

            {
                "channel_id": "1",
                "community_ids": ["1"]
            }
            """
    )
    @api.expect(attach_community_parser)
    @require_admin_key
    def post(self):
        """ Attach community to channel """
        data = request.get_json()
        channel_id = data.get('channel_id')
        community_ids = data.get('community_ids')

        with session_scope() as session:
            try:
                for community_id in community_ids:
                    Community.attach_channel(session, channel_id, community_id)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )

        return Response(
            json.dumps({'message': 'Communities attached successfully'}),
            status=200, mimetype='application/json'
        )