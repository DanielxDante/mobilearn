import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
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