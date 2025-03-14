import pytest

# Authentication Tests
def test_protected_route_with_auth(client, auth_headers):
    """Test accessing a protected route with authentication"""
    response = client.get('/api/user/profile',
                         headers=auth_headers)
    assert response.status_code == 200

def test_protected_route_without_auth(client):
    """Test accessing a protected route without authentication"""
    response = client.get('/api/user/profile')
    assert response.status_code == 401