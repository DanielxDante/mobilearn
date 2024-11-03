# class ChangePasswordEndpoint(Resource):
#     @api.doc(
#         responses={
#             200: 'Ok',
#             400: 'Bad request',
#             401: 'Unauthorized',
#             404: 'Resource not found',
#             500: 'Internal Server Error'
#         },
#         params={
#             'Authorization': {
#                 'in': 'header',
#                 'description': 'Bearer token',
#                 'required': True
#             }
#         },
#         description="""
#             Example request JSON:

#             {
#                 "old_password": "bar",
#                 "new_password": "bar2"
#             }
#             """
#     )
#     @api.expect(change_password_parser)
#     @jwt_required()
#     def post(self):
#         data = request.get_json()
#         old_password = data.get('old_password')
#         new_password = data.get('new_password')

#         current_email = get_jwt_identity()
        
#         with session_scope() as session:
#             try:
#                 User.change_password(session, current_email, old_password, new_password)
#             except ValueError as ee:
#                 return Response(
#                     json.dumps({'message': str(ee)}),
#                     status=400, mimetype='application/json'
#                 )
        
#         return Response(
#             json.dumps({'message': 'Password changed successfully'}),
#             status=200, mimetype='application/json'
#         )