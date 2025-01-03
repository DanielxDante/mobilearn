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
from models.course import Course
from models.lesson import Lesson

# class GetLessonEndpoint(Resource):

# class CompleteLessonEndpoint(Resource):