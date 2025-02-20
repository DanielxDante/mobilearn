import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import api
from database import session_scope, create_session
from services.chat_services import ChatService

class GetChatMessagesEndpoint(Resource):
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
            },
            'page': {
                'in': 'query',
                'description': 'Page number',
                'required': False
            },
            'per_page': {
                'in': 'query',
                'description': 'Number of users per page',
                'required': False
            }
        }
    )
    @jwt_required()
    def get(self, chat_id, chat_participant_id):
        """ Get paginated chat messages """
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        current_email = get_jwt_identity()

        session = create_session()

        try:
            messages = ChatService.get_chat_messages(
                session,
                chat_id=chat_id,
                page=page,
                per_page=per_page
            )

            ChatService.update_last_read(session, chat_id, chat_participant_id)

            return Response(
                json.dumps({'messages': [{
                    'message_id': message.id,
                    'chat_participant_id': message.sender_id,
                    'content': message.content,
                    'timestamp': message.timestamp.isoformat()
                } for message in messages]}),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({'message': str(ee)}),
                status=404, mimetype='application/json'
            )
        except Exception as ee:
            return Response(
                json.dumps({'error': str(ee)}),
                status=500, mimetype='application/json'
            )
        finally:
            session.close()
        
