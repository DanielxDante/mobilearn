import os
import json
from flask import Response, request
from flask_restx import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
import stripe

from app import api
from database import session_scope, create_session

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

fetch_payment_sheet_parser = api.parser()
fetch_payment_sheet_parser.add_argument('amount', type=str, help='Amount', location='json', required=True)
fetch_payment_sheet_parser.add_argument('currency', type=str, help='Currency', location='json', required=True)

class FetchPaymentSheetEndpoint(Resource):
    @api.doc(
        responses={
            200: 'Ok',
            400: 'Bad Request',
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
                "amount": "69.42",
                "currency": "SGD"
            }
            """
    )
    @api.expect(fetch_payment_sheet_parser)
    @jwt_required()
    def post(self):
        """ Fetch Stripe payment sheet """
        data = request.json
        amount = data.get('amount')
        currency = data.get('currency')

        current_email = get_jwt_identity()

        try:
            customer = stripe.Customer.create()
            customer_id = customer["id"]

            ephemeral_key = stripe.EphemeralKey.create(
                customer=customer_id,
                stripe_version="2024-12-18.acacia"
            )

            payment_intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),
                currency=currency,
                customer=customer_id,
                automatic_payment_methods={
                    'enabled': True
                }
            )
            
            return Response(
                json.dumps({
                    "payment_intent": payment_intent.client_secret,
                    "ephemeral_key": ephemeral_key.secret,
                    "customer_id": customer_id
                }),
                status=200, mimetype='application/json'
            )
        except ValueError as ee:
            return Response(
                json.dumps({"error": str(ee)}),
                status=500, mimetype='application/json'
            )
        