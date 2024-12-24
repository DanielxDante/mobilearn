import os
import json
from botocore.exceptions import ClientError
from flask import Response, request
from flask_restx import Resource

from app import api
from database import session_scope, create_session
from models.channel import Channel
from utils.admin_decorator import require_admin_key
from utils.s3 import s3_client, allowed_file, bucket_name, cloudfront_domain

create_channel_parser = api.parser()
create_channel_parser.add_argument('name', type=str, help='Name', location='form', required=True)
create_channel_parser.add_argument('description', type=str, help='Description', location='form', required=True)
create_channel_parser.add_argument('invite_code', type=str, help='Invite Code', location='form', required=True)

class CreateChannelEndpoint(Resource):
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
                'description': 'Channel picture',
                'required': False
            }
        },
        description="""
            Example request JSON:

            {
                "name": "Singapore Universities",
                "description": "Channel for Singapore Universities",
                "invite_code": "sg_uni123"
            }
            """
    )
    @api.expect(create_channel_parser)
    @require_admin_key
    def post(self):
        """ Create channel """
        data = request.form
        name = data.get('name')
        description = data.get('description')
        invite_code = data.get('invite_code')  

        with session_scope() as session:
            try:
                channel = Channel.add_channel(session, name, description, invite_code)
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
                    unique_filename = f"channel_{str(channel.id)}{file_extension}"

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

                    Channel.change_channel_picture_url(session, channel.id, image_url)
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
            json.dumps({'channel_id': channel.id}),
            status=200, mimetype='application/json'
        )
