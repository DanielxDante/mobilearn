from functools import wraps
from flask import request, abort

from app import app

def require_admin_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-Admin-Key')
        if not api_key or api_key != app.config['ADMIN_API_KEY']:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function