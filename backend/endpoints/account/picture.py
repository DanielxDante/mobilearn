# import os
# import json
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from flask_restx import Resource, fields, marshal
# from flask import Response, request
# from werkzeug.utils import secure_filename
# import boto3
# from botocore.exceptions import ClientError

# from app import api
# from database import session_scope, create_session
# from models.user import User

# s3 = boto3.client(
#     's3',
#     aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
#     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
#     region_name=os.getenv('AWS_REGION')
# )
# bucket_name = os.getenv('S3_BUCKET')
# cloudfront_domain = os.getenv('CLOUDFRONT_DOMAIN')

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# class GetProfilePictureEndpoint(Resource):
#     @api.doc(
#         params= {
#           'Authorization': {
#               'in': 'header',
#               'description': 'Bearer token',
#               'required': True
#           }
#         },
#         description="""
#         Get the profile picture URL of the current user.
#         """
#     )
#     @jwt_required()
#     def get(self):
#         current_email = get_jwt_identity()
        
#         with session_scope() as session:
#             try:
#                 user = User.get_user_by_email(session, current_email)
#                 image_url = user.profile_picture_url
#                 if not image_url:
#                     image_url = ""
#             except Exception as e:
#                 return Response(
#                     json.dumps({'message': str(e)}),
#                     status=500, mimetype='application/json'
#                 )
#         return Response(
#             json.dumps({'image_url': image_url}),
#             status=200, mimetype='application/json'
#         )

# class UploadProfilePictureEndpoint(Resource):
#     @api.doc(
#         params= {
#           'Authorization': {
#               'in': 'header',
#               'description': 'Bearer token',
#               'required': True
#           },
#           'file': {
#                 'in': 'formData',
#                 'type': 'file',
#                 'description': 'The file to upload',
#                 'required': True
#             }
#         },
#         description="""
#         Upload a profile picture to S3 and return the URL.
#         """
#     )
#     @jwt_required()
#     def post(self):
#         if 'file' not in request.files:
#             return Response(
#                 json.dumps({'message': "No file part"}),
#                 status=400, mimetype='application/json'
#             )
        
#         file = request.files['file']
        
#         if file.filename == '':
#             return Response(
#                 json.dumps({'message': "No selected file"}),
#                 status=400, mimetype='application/json'
#             )
        
#         if not allowed_file(file.filename):
#             return Response(
#                 json.dumps({'message': "Invalid file type"}),
#                 status=400, mimetype='application/json'
#             )
        
#         current_email = get_jwt_identity()
        
#         with session_scope() as session:
#             try:
#                 user = User.get_user_by_email(session, current_email)

#                 file_extension = os.path.splitext(file.filename)[1]
#                 unique_filename = f"{str(user.id)}{file_extension}"

#                 # Check if the user already has a profile picture
#                 try:
#                     base_filename = os.path.splitext(unique_filename)[0]
#                     response = s3.list_objects_v2(Bucket=bucket_name, Prefix=base_filename)
#                     if 'Contents' in response:
#                         for obj in response['Contents']:
#                             s3.delete_object(Bucket=bucket_name, Key=obj['Key'])
#                 except ClientError as e:
#                     if e.response['Error']['Code'] != '404':
#                         raise

#                 # Upload the new profile picture
#                 s3.upload_fileobj(
#                     file,
#                     bucket_name,
#                     unique_filename,
#                     ExtraArgs={
#                         'ContentType': file.content_type
#                     }
#                 )

#                 image_url = f"https://{cloudfront_domain}/{unique_filename}"

#                 user.profile_picture_url = image_url
            
#             except ClientError as e:
#                 return Response(
#                     json.dumps({'message': "Upload failed"}),
#                     status=500, mimetype='application/json'
#                 )
#             except Exception as e:
#                 return Response(
#                     json.dumps({'message': "Server error"}),
#                     status=500, mimetype='application/json'
#                 )
#         return Response(
#             json.dumps({'image_url': image_url}),
#             status=200, mimetype='application/json'
#         )
