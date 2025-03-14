import pytest
import json
from config import TestConfig
from app import create_app, db


@pytest.fixture
def app():
    """Create and configure a Flask app for testing"""
    app = create_app(TestConfig)
    
    # Create a test context
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create test data
        test_user = User(username="testuser", email="test@example.com")
        test_user.set_password("password123")
        db.session.add(test_user)
        
        yield app
        
        # Clean up after the test
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()

@pytest.fixture
def auth_headers(app, client):
    """Get authentication token and create headers"""
    response = client.post('/api/login',
                          data=json.dumps({'username': 'testuser', 'password': 'password123'}),
                          content_type='application/json')
    token = json.loads(response.data)['token']
    return {'Authorization': f'Bearer {token}'}