import os
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
from models.user import User, GENDER as USER_GENDER
from models.instructor import Instructor, GENDER as INSTRUCTOR_GENDER
from utils.s3 import s3_client, allowed_file, bucket_name, cloudfront_domain

class GetUserNameEndpoint(Resource):
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
        """ Get user name """
        current_email = get_jwt_identity()

        session = create_session()
        
        try:
            user = User.get_user_by_email(session, current_email)
            return Response(
                json.dumps({'name': user.name}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee: 
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({'message': str(e)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()

change_user_name_parser = api.parser()
change_user_name_parser.add_argument('new_name', type=str, help='New Name', location='json', required=True)

class ChangeUserNameEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_name": "foo2"
            }
            """
    )
    @api.expect(change_user_name_parser)
    @jwt_required()
    def post(self):
        """ Change user name """
        data = request.get_json()
        new_name = data.get('new_name')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                User.change_name(session, current_email, new_name)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'User name updated successfully'}),
            status=200, mimetype='application/json'
        )
    
class GetUserGenderEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            404: 'Resource not found',
            401: 'Unauthorized',
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
        """ Get user gender """
        current_email = get_jwt_identity()

        session = create_session()
        
        user = User.get_user_by_email(session, current_email)
        if user:
            return Response(
                json.dumps({'gender': user.gender}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'User not found'}),
            status=500, mimetype='application/json'
        )
    
change_user_gender_parser = api.parser()
change_user_gender_parser.add_argument(
    'new_gender', 
    type=str, 
    help='New Gender', 
    location='json', 
    required=True, 
    choices=USER_GENDER.values()
)

class ChangeUserGenderEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_gender": "female"
            }
            """
    )
    @api.expect(change_user_gender_parser)
    @jwt_required()
    def post(self):
        """ Change user gender """
        data = request.get_json()
        new_gender = data.get('new_gender')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                User.change_gender(session, current_email, new_gender)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'User gender updated successfully'}),
            status=200, mimetype='application/json'
        )

class GetUserProfilePictureEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          }
        }
    )
    @jwt_required()
    def get(self):
        """ Get user profile picture URL """
        current_email = get_jwt_identity()

        session = create_session()
        
        user = User.get_user_by_email(session, current_email)
        if user:
            profile_picture_url = user.profile_picture_url
            if not profile_picture_url:
                profile_picture_url = ""

            return Response(
                json.dumps({'profile_picture_url': profile_picture_url}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'User not found'}),
            status=500, mimetype='application/json'
        )

class ChangeUserProfilePictureEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          },
          'file': {
                'in': 'formData',
                'type': 'file',
                'description': 'The file to upload',
                'required': True
            }
        }
    )
    @jwt_required()
    def post(self):
        """ Upload profile picture to S3 and return CloudFront URL """
        if 'file' not in request.files:
            return Response(
                json.dumps({'message': "No file part"}),
                status=400, mimetype='application/json'
            )
        
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
        
        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                user = User.get_user_by_email(session, current_email)

                file_extension = os.path.splitext(file.filename)[1]
                unique_filename = f"user_{str(user.id)}{file_extension}"

                # Check if the user already has a profile picture
                try:
                    base_filename = os.path.splitext(unique_filename)[0]
                    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=base_filename)
                    if 'Contents' in response:
                        for obj in response['Contents']:
                            s3_client.delete_object(Bucket=bucket_name, Key=obj['Key'])
                except ClientError as e:
                    if e.response['Error']['Code'] != '404':
                        raise

                # Upload the new profile picture
                s3_client.upload_fileobj(
                    file,
                    bucket_name,
                    unique_filename,
                    ExtraArgs={
                        'ContentType': file.content_type,
                        'CacheControl': 'max-age=1'
                    }
                )

                image_url = f"https://{cloudfront_domain}/{unique_filename}"

                User.change_profile_picture_url(session, current_email, image_url)
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
            json.dumps({'profile_picture_url': image_url}),
            status=200, mimetype='application/json'
        )

class GetInstructorNameEndpoint(Resource):
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
        """ Get instructor name """
        current_email = get_jwt_identity()

        session = create_session()
        
        instructor = Instructor.get_instructor_by_email(session, current_email)
        if instructor:
            return Response(
                json.dumps({'name': instructor.name}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'Instructor not found'}),
            status=500, mimetype='application/json'
        )

change_instructor_name_parser = api.parser()
change_instructor_name_parser.add_argument('new_name', type=str, help='New Name', location='json', required=True)

class ChangeInstructorNameEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_name": "foo2"
            }
            """
    )
    @api.expect(change_instructor_name_parser)
    @jwt_required()
    def post(self):
        """ Change instructor name """
        data = request.get_json()
        new_name = data.get('new_name')
        
        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                Instructor.change_name(session, current_email, new_name)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'Instructor name updated successfully'}),
            status=200, mimetype='application/json'
        )
    
class GetInstructorGenderEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            404: 'Resource not found',
            401: 'Unauthorized',
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
        """ Get instructor gender """
        current_email = get_jwt_identity()

        session = create_session()
        
        instructor = Instructor.get_instructor_by_email(session, current_email)
        if instructor:
            return Response(
                json.dumps({'gender': instructor.gender}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'Instructor not found'}),
            status=500, mimetype='application/json'
        )

change_instructor_gender_parser = api.parser()
change_instructor_gender_parser.add_argument(
    'new_gender', 
    type=str, 
    help='New Gender', 
    location='json', 
    required=True, 
    choices=INSTRUCTOR_GENDER.values()
)

class ChangeInstructorGenderEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_gender": "female"
            }
            """
    )
    @api.expect(change_instructor_gender_parser)
    @jwt_required()
    def post(self):
        """ Change instructor gender """
        data = request.get_json()
        new_gender = data.get('new_gender')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                Instructor.change_gender(session, current_email, new_gender)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'Instructor gender updated successfully'}),
            status=200, mimetype='application/json'
        )

class GetInstructorProfilePictureEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          }
        }
    )
    @jwt_required()
    def get(self):
        """ Get instructor profile picture URL """
        current_email = get_jwt_identity()

        session = create_session()
        
        instructor = Instructor.get_instructor_by_email(session, current_email)
        if instructor:
            profile_picture_url = instructor.profile_picture_url
            if not profile_picture_url:
                profile_picture_url = ""

            return Response(
                json.dumps({'profile_picture_url': profile_picture_url}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'Instructor not found'}),
            status=500, mimetype='application/json'
        )

class ChangeInstructorProfilePictureEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
            401: 'Unauthorized',
            404: 'Resource not found',
            500: 'Internal Server Error'
        },
        params= {
          'Authorization': {
              'in': 'header',
              'description': 'Bearer token',
              'required': True
          },
          'file': {
                'in': 'formData',
                'type': 'file',
                'description': 'The file to upload',
                'required': True
            }
        }
    )
    @jwt_required()
    def post(self):
        """ Upload profile picture to S3 and return CloudFront URL """
        if 'file' not in request.files:
            return Response(
                json.dumps({'message': "No file part"}),
                status=400, mimetype='application/json'
            )
        
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
        
        current_email = get_jwt_identity()
        
        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_email(session, current_email)

                file_extension = os.path.splitext(file.filename)[1]
                unique_filename = f"instructor_{str(instructor.id)}{file_extension}"

                # Check if the instructor already has a profile picture
                try:
                    base_filename = os.path.splitext(unique_filename)[0]
                    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=base_filename)
                    if 'Contents' in response:
                        for obj in response['Contents']:
                            s3_client.delete_object(Bucket=bucket_name, Key=obj['Key'])
                except ClientError as e:
                    if e.response['Error']['Code'] != '404':
                        raise

                # Upload the new profile picture
                s3_client.upload_fileobj(
                    file,
                    bucket_name,
                    unique_filename,
                    ExtraArgs={
                        'ContentType': file.content_type
                    }
                )

                image_url = f"https://{cloudfront_domain}/{unique_filename}"

                Instructor.change_profile_picture_url(session, current_email, image_url)
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
            json.dumps({'profile_picture_url': image_url}),
            status=200, mimetype='application/json'
        )

class GetInstructorPhoneNumberEndpoint(Resource):
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
        """ Get instructor phone number """
        current_email = get_jwt_identity()

        session = create_session()
        
        instructor = Instructor.get_instructor_by_email(session, current_email)
        if instructor:
            return Response(
                json.dumps({'phone_number': instructor.phone_number}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'Instructor not found'}),
            status=500, mimetype='application/json'
        )

change_instructor_phone_number_parser = api.parser()
change_instructor_phone_number_parser.add_argument(
    'new_phone_number',
    type=str,
    help='New Phone Number',
    location='json',
    required=True
)

class ChangeInstructorPhoneNumberEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_phone_number": "12345678"
            }
            """
    )
    @api.expect(change_instructor_phone_number_parser)
    @jwt_required()
    def post(self):
        """ Change instructor phone number """
        data = request.get_json()
        new_phone_number = data.get('new_phone_number')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                Instructor.change_phone_number(session, current_email, new_phone_number)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'Instructor phone number updated successfully'}),
            status=200, mimetype='application/json'
        )

class GetInstructorPositionEndpoint(Resource):
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
        """ Get instructor position """
        current_email = get_jwt_identity()

        session = create_session()
        
        instructor = Instructor.get_instructor_by_email(session, current_email)
        if instructor:
            return Response(
                json.dumps({'position': instructor.position}),
                status=200, mimetype='application/json'
            )
        return Response(
            json.dumps({'message': 'Instructor not found'}),
            status=500, mimetype='application/json'
        )

change_instructor_position_parser = api.parser()
change_instructor_position_parser.add_argument(
    'new_position',
    type=str,
    help='New Position',
    location='json',
    required=True
)

class ChangeInstructorPositionEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad request',
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
                "new_position": "Software Engineer"
            }
            """
    )
    @api.expect(change_instructor_position_parser)
    @jwt_required()
    def post(self):
        """ Change instructor position """
        data = request.get_json()
        new_position = data.get('new_position')

        current_email = get_jwt_identity()

        with session_scope() as session:
            try:
                Instructor.change_position(session, current_email, new_position)
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
        return Response(
            json.dumps({'message': 'Instructor position updated successfully'}),
            status=200, mimetype='application/json'
        )