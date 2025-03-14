# SAMPLE ROUTE TESTS

import pytest
import json

# GET Endpoint Tests
def test_get_all_products(client):
    """Test retrieving all products"""
    response = client.get('/api/products')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]['name'] == 'Test Product'

def test_get_product_by_id(client, app):
    """Test retrieving a specific product by ID"""
    response = client.get(f'/api/products/{app.test_product_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Test Product'
    assert data['price'] == 19.99

def test_get_nonexistent_product(client):
    """Test retrieving a product that doesn't exist"""
    response = client.get('/api/products/999')
    assert response.status_code == 404

# POST Endpoint Tests
def test_create_product(client, auth_headers):
    """Test creating a new product"""
    product_data = {
        'name': 'New Product',
        'price': 29.99,
        'description': 'A new test product'
    }
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          content_type='application/json',
                          headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['name'] == 'New Product'
    
    # Verify it was actually added
    response = client.get('/api/products')
    data = json.loads(response.data)
    assert len(data) == 2

def test_create_product_missing_fields(client, auth_headers):
    """Test creating a product with missing required fields"""
    product_data = {
        'name': 'Incomplete Product'
        # Missing price and description
    }
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          content_type='application/json',
                          headers=auth_headers)
    assert response.status_code == 400

# PUT Endpoint Tests
def test_update_product(client, app, auth_headers):
    """Test updating an existing product"""
    update_data = {
        'price': 24.99,
        'description': 'Updated description'
    }
    response = client.put(f'/api/products/{app.test_product_id}',
                         data=json.dumps(update_data),
                         content_type='application/json',
                         headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['price'] == 24.99
    assert data['description'] == 'Updated description'
    assert data['name'] == 'Test Product'  # Unchanged field

def test_update_nonexistent_product(client, auth_headers):
    """Test updating a product that doesn't exist"""
    update_data = {'price': 24.99}
    response = client.put('/api/products/999',
                         data=json.dumps(update_data),
                         content_type='application/json',
                         headers=auth_headers)
    assert response.status_code == 404

# DELETE Endpoint Tests
def test_delete_product(client, app, auth_headers):
    """Test deleting a product"""
    response = client.delete(f'/api/products/{app.test_product_id}',
                            headers=auth_headers)
    assert response.status_code == 204
    
    # Verify it was deleted
    response = client.get(f'/api/products/{app.test_product_id}')
    assert response.status_code == 404

def test_delete_nonexistent_product(client, auth_headers):
    """Test deleting a product that doesn't exist"""
    response = client.delete('/api/products/999',
                            headers=auth_headers)
    assert response.status_code == 404
