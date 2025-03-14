import pytest
import json
from flask import request, g
from app import create_app
from models import db, User, RequestLog
from config import TestConfig

# Request Logging Middleware Tests
def test_request_logging_middleware(client, app):
    """Test that requests are properly logged by middleware"""
    # Make a request
    response = client.get('/api/products')
    assert response.status_code == 200
    
    # Check that the request was logged in the database
    with app.app_context():
        log_entry = RequestLog.query.order_by(RequestLog.timestamp.desc()).first()
        assert log_entry is not None
        assert log_entry.method == 'GET'
        assert log_entry.path == '/api/products'
        assert log_entry.status_code == 200
        assert log_entry.response_time is not None  # Should have timing info

def test_request_logging_with_error(client, app):
    """Test that error responses are properly logged"""
    # Make a request to a non-existent endpoint
    response = client.get('/api/nonexistent')
    assert response.status_code == 404
    
    # Check that the error was logged
    with app.app_context():
        log_entry = RequestLog.query.order_by(RequestLog.timestamp.desc()).first()
        assert log_entry is not None
        assert log_entry.method == 'GET'
        assert log_entry.path == '/api/nonexistent'
        assert log_entry.status_code == 404

# Rate Limiting Middleware Tests
def test_rate_limiting(client, app):
    """Test that rate limiting middleware works correctly"""
    # Make requests up to the limit (assuming limit is 5 per minute)
    for _ in range(5):
        response = client.get('/api/products')
        assert response.status_code == 200
    
    # Next request should be rate limited
    response = client.get('/api/products')
    assert response.status_code == 429  # Too Many Requests
    
    data = json.loads(response.data)
    assert 'error' in data
    assert 'rate limit' in data['error'].lower()
    
    # Headers should indicate rate limit info
    assert 'X-RateLimit-Limit' in response.headers
    assert 'X-RateLimit-Remaining' in response.headers
    assert 'X-RateLimit-Reset' in response.headers
    assert int(response.headers['X-RateLimit-Remaining']) == 0

# CORS Middleware Tests
def test_cors_headers(client):
    """Test that CORS headers are properly set"""
    # Make a preflight OPTIONS request
    response = client.options('/api/products', headers={
        'Origin': 'http://example.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
    })
    
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' in response.headers
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers
    
    # Verify allowed origin
    if response.headers['Access-Control-Allow-Origin'] != '*':
        assert 'http://example.com' in response.headers['Access-Control-Allow-Origin']
    
    # Verify allowed methods
    assert 'GET' in response.headers['Access-Control-Allow-Methods']
    
    # Verify actual request with CORS
    response = client.get('/api/products', headers={'Origin': 'http://example.com'})
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' in response.headers

# Request Preprocessing Middleware Tests
def test_json_body_parsing(client):
    """Test that JSON request bodies are properly preprocessed"""
    # Create a test endpoint that echoes the parsed JSON
    response = client.post('/api/echo',
                          data=json.dumps({'message': 'test message'}),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'test message'

def test_form_data_parsing(client):
    """Test that form data is properly preprocessed"""
    # Create a test endpoint that echoes the parsed form data
    response = client.post('/api/echo',
                          data={'message': 'test message'},
                          content_type='application/x-www-form-urlencoded')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'test message'

# Response Postprocessing Middleware Tests
def test_response_headers(client):
    """Test that common headers are added to all responses"""
    response = client.get('/api/products')
    
    assert response.status_code == 200
    assert 'X-Content-Type-Options' in response.headers
    assert response.headers['X-Content-Type-Options'] == 'nosniff'
    assert 'X-Frame-Options' in response.headers
    assert 'X-XSS-Protection' in response.headers

def test_response_timing_header(client):
    """Test that response timing header is added"""
    response = client.get('/api/products')
    
    assert response.status_code == 200
    assert 'X-Response-Time' in response.headers
    # Verify it's a number in milliseconds
    assert float(response.headers['X-Response-Time'].rstrip('ms')) > 0

# Authentication Middleware Tests
def test_auth_middleware_sets_current_user(client, auth_headers, app):
    """Test that auth middleware correctly sets current user"""
    # Create a test endpoint that returns current user info
    response = client.get('/api/user/me', headers=auth_headers)
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['username'] == 'testuser'
    
    # Verify g.current_user was set
    @app.route('/api/test-g-user')
    def test_g_user():
        return {'user_set': hasattr(g, 'current_user')}
    
    response = client.get('/api/test-g-user', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['user_set'] is True

def test_auth_middleware_rejects_invalid_token(client):
    """Test that auth middleware rejects invalid tokens"""
    response = client.get('/api/user/me', headers={
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json'
    })
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data
    assert 'unauthorized' in data['error'].lower()

def test_auth_middleware_handles_expired_token(client, app):
    """Test that auth middleware handles expired tokens"""
    # Create a token that's already expired
    with app.app_context():
        user = User.query.filter_by(username='testuser').first()
        # Using a direct method to create an expired token
        # This assumes your app has a method like this
        expired_token = user.generate_auth_token(expiration=-1)  # Expired
    
    response = client.get('/api/user/me', headers={
        'Authorization': f'Bearer {expired_token}',
        'Content-Type': 'application/json'
    })
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data
    assert 'expired' in data['error'].lower()

# Request Context Middleware Tests
def test_request_id_middleware(client):
    """Test that each request gets a unique request ID"""
    response = client.get('/api/products')
    
    assert response.status_code == 200
    assert 'X-Request-ID' in response.headers
    request_id_1 = response.headers['X-Request-ID']
    
    # Make another request and verify ID is different
    response = client.get('/api/products')
    assert 'X-Request-ID' in response.headers
    request_id_2 = response.headers['X-Request-ID']
    
    assert request_id_1 != request_id_2

# Error Handling Middleware Tests
def test_error_handling_middleware(client):
    """Test that errors are properly caught and formatted"""
    # Trigger a 404 error
    response = client.get('/api/nonexistent')
    
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
    assert 'message' in data
    assert 'status_code' in data
    assert data['status_code'] == 404
    
    # Trigger a 500 error (requires a route that raises an exception)
    response = client.get('/api/trigger-error')
    
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data
    assert 'message' in data
    assert 'status_code' in data
    assert data['status_code'] == 500

# Middleware Execution Order Tests
def test_middleware_execution_order(client, app):
    """Test that middlewares execute in the correct order"""
    # This test requires a custom endpoint that captures middleware execution order
    response = client.get('/api/middleware-order')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Verify the order matches what we expect
    # For example, we might expect:
    # 1. Request ID middleware
    # 2. Request logging start
    # 3. CORS middleware
    # 4. Authentication middleware
    # 5. Rate limiting middleware
    # 6. Request body parsing
    # 7. Your route handler
    # 8. Response post-processing
    # 9. Request logging completion
    
    expected_order = [
        'request_id',
        'request_logging_start',
        'cors',
        'authentication',
        'rate_limiting',
        'body_parsing',
        'route_handler',
        'response_post_processing',
        'request_logging_end'
    ]
    
    assert data['middleware_order'] == expected_order