import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from models.user import User
from models.instructor import Instructor
from models.notification import Notification
from services.notification_services import NotificationService

class GetUserUnreadNotificationsEndpoint(Resource):
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
        """ Get unread notifications for users """
        user_email = get_jwt_identity()

        session = create_session()

        try:
            notifications = NotificationService.get_unread_notifications(
                session,
                recipient_email=user_email,
                recipient_type='user'
            )

            return Response(
                json.dumps({
                    "notifications": [{
                        'id': notification.id,
                        'title': notification.title,
                        'body': notification.body,
                        'notification_type': notification.notification_type,
                        'timestamp': notification.timestamp.isoformat(),
                    } for notification in notifications]
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                response=json.dumps({'message': str(e)}),
                status=500, mimetype='application/json'
            )

user_add_notification_parser = api.parser()
user_add_notification_parser.add_argument('title', type=str, help='Title', location='json', required=True)
user_add_notification_parser.add_argument('body', type=str, help='Body', location='json', required=True)
user_add_notification_parser.add_argument('notification_type', type=str, help='Notification type', location='json', required=True)

class UserAddNotificationEndpoint(Resource):
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
        description="""
            Example JSON string:

            {
                "title": "Welcome!",
                "body": "Start your learning journey with us today!",
                "notification_type": "info"
            }
            """
    )
    @api.expect(user_add_notification_parser)
    @jwt_required()
    def post(self):
        """ Add a notification for users """
        data = request.get_json()
        title = data.get('title')
        body = data.get('body')
        notification_type = data.get('notification_type')

        user_email = get_jwt_identity()

        with session_scope() as session:
            try:
                user = User.get_user_by_email(session, user_email)

                NotificationService.add_notification(
                    session,
                    title=title,
                    body=body,
                    notification_type=notification_type,
                    recipient_id=user.id,
                    recipient_type='user'
                )

                return Response(
                    json.dumps({'message': 'Notification added'}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as e:
                return Response(
                    response=json.dumps({'message': str(e)}),
                    status=500, mimetype='application/json'
                )

class GetInstructorUnreadNotificationsEndpoint(Resource):
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
        """ Get unread notifications for instructors """
        instructor_email = get_jwt_identity()

        session = create_session()

        try:
            notifications = NotificationService.get_unread_notifications(
                session,
                recipient_email=instructor_email,
                recipient_type='instructor'
            )

            return Response(
                json.dumps({
                    "notifications": [{
                        'id': notification.id,
                        'title': notification.title,
                        'body': notification.body,
                        'notification_type': notification.notification_type,
                        'timestamp': notification.timestamp.isoformat(),
                    } for notification in notifications]
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as e:
            return Response(
                response=json.dumps({'message': str(e)}),
                status=500, mimetype='application/json'
            )

instructor_add_notification_parser = api.parser()
instructor_add_notification_parser.add_argument('title', type=str, help='Title', location='json', required=True)
instructor_add_notification_parser.add_argument('body', type=str, help='Body', location='json', required=True)
instructor_add_notification_parser.add_argument('notification_type', type=str, help='Notification type', location='json', required=True)

class InstructorAddNotificationEndpoint(Resource):
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
        description="""
            Example JSON string:

            {
                "title": "Welcome!",
                "body": "Start creating courses with MobiLearn today!",
                "notification_type": "info"
            }
            """
    )
    @api.expect(instructor_add_notification_parser)
    @jwt_required()
    def post(self):
        """ Add a notification for instructors """
        data = request.get_json()
        title = data.get('title')
        body = data.get('body')
        notification_type = data.get('notification_type')

        instructor_email = get_jwt_identity()

        with session_scope() as session:
            try:
                instructor = Instructor.get_instructor_by_email(session, instructor_email)

                NotificationService.add_notification(
                    session,
                    title=title,
                    body=body,
                    notification_type=notification_type,
                    recipient_id=instructor.id,
                    recipient_type='instructor'
                )

                return Response(
                    json.dumps({'message': 'Notification added'}),
                    status=200, mimetype='application/json'
                )
            except ValueError as ee:
                return Response(
                    json.dumps({'message': str(ee)}),
                    status=400, mimetype='application/json'
                )
            except Exception as e:
                return Response(
                    response=json.dumps({'message': str(e)}),
                    status=500, mimetype='application/json'
                )