import pytest
import json
from models import db, Course

# Query Parameter Tests
@pytest.fixture
def additional_products(app):
    """Add more products for testing filters and pagination"""
    with app.app_context():
        products = [
            Course(name="Cheap Course", price=5.99, description="A cheap product"),
            Course(name="Expensive Course", price=99.99, description="An expensive product")
        ]
        db.session.add_all(products)
        db.session.commit()
        yield

def test_product_filtering(client, additional_products):
    """Test filtering products by price range"""
    response = client.get('/api/products?min_price=10&max_price=50')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['name'] == 'Test Course'

@pytest.fixture
def pagination_products(app):
    """Add more products for pagination testing"""
    with app.app_context():
        products = [Course(name=f"Course {i}", price=10.99, description=f"Course {i}") 
                   for i in range(2, 22)]  # Add 20 more products
        db.session.add_all(products)
        db.session.commit()
        yield

def test_pagination(client, pagination_products):
    """Test pagination of products"""
    # Test first page
    response = client.get('/api/products?page=1&per_page=10')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['items']) == 10
    assert data['total'] == 21
    assert data['pages'] == 3
    
    # Test second page
    response = client.get('/api/products?page=2&per_page=10')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['items']) == 10
    
    # Test last page
    response = client.get('/api/products?page=3&per_page=10')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['items']) == 1

# Malformed JSON Tests
def test_malformed_json(client, auth_headers):
    """Test handling of malformed JSON in request"""
    # Send invalid JSON
    response = client.post('/api/products',
                          data="{name: 'Broken Course', price: 29.99,",  # Invalid JSON
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Invalid JSON' in data['error']

# Missing Required Fields Tests
def test_missing_required_fields(client, auth_headers):
    """Test validation for missing required fields"""
    # Test with empty request body
    response = client.post('/api/products',
                          data=json.dumps({}),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'name' in data['errors']
    assert 'price' in data['errors']
    
    # Test with partial data
    response = client.post('/api/products',
                          data=json.dumps({'name': 'Test Course'}),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'price' in data['errors']
    assert 'name' not in data['errors']

# Incorrect Data Types Tests
def test_incorrect_data_types(client, auth_headers):
    """Test validation for incorrect data types"""
    # Test with string instead of number for price
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': 'Test Course',
                              'price': 'not-a-number',
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'price' in data['errors']
    
    # Test with number instead of string for name
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': 123,
                              'price': 29.99,
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'name' in data['errors']

# Boundary Value Tests
def test_string_length_limits(client, auth_headers):
    """Test validation for string length limits"""
    # Test with too short name
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': 'A',  # Assuming minimum length is more than 1
                              'price': 29.99,
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'name' in data['errors']
    
    # Test with too long name
    very_long_name = 'A' * 256  # Assuming maximum length is 255
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': very_long_name,
                              'price': 29.99,
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'name' in data['errors']

def test_number_limits(client, auth_headers):
    """Test validation for number limits"""
    # Test with negative price
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': 'Test Course',
                              'price': -10.99,
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'price' in data['errors']
    
    # Test with price that's too high
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': 'Test Course',
                              'price': 1000000.00,  # Assuming there's a reasonable maximum
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'price' in data['errors']

# Special Character Validation Tests
def test_special_characters(client, auth_headers):
    """Test validation for special characters in strings"""
    # Test with special characters in name
    response = client.post('/api/products',
                          data=json.dumps({
                              'name': '<script>alert("XSS")</script>',
                              'price': 29.99,
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'name' in data['errors']

# Email Validation Tests
def test_email_validation(client):
    """Test validation for email format"""
    # Test with invalid email format
    response = client.post('/api/register',
                          data=json.dumps({
                              'username': 'newuser',
                              'email': 'not-an-email',
                              'password': 'password123'
                          }),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'email' in data['errors']
    
    # Test with valid email format
    response = client.post('/api/register',
                          data=json.dumps({
                              'username': 'newuser',
                              'email': 'valid@example.com',
                              'password': 'password123'
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201

# Date Format Validation Tests
def test_date_format_validation(client, auth_headers):
    """Test validation for date format"""
    # Test with invalid date format
    response = client.post('/api/events',
                          data=json.dumps({
                              'title': 'Test Event',
                              'date': '2023/13/45',  # Invalid date
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'date' in data['errors']
    
    # Test with valid date format
    response = client.post('/api/events',
                          data=json.dumps({
                              'title': 'Test Event',
                              'date': '2023-03-15T14:30:00Z',  # ISO format
                              'description': 'Test description'
                          }),
                          headers=auth_headers)
    
    assert response.status_code == 201

# Duplicate Resource Tests
def test_duplicate_resource(client, auth_headers):
    """Test validation for duplicate resources"""
    # First creation should succeed
    product_data = {
        'name': 'Unique Course',
        'price': 29.99,
        'description': 'Test description',
        'sku': 'ABC123'  # Assuming SKU must be unique
    }
    
    response = client.post('/api/products',
                          data=json.dumps(product_data),
                          headers=auth_headers)
    
    assert response.status_code == 201
    
    # Second creation with same SKU should fail
    duplicate_data = {
        'name': 'Different Name',
        'price': 39.99,
        'description': 'Different description',
        'sku': 'ABC123'  # Same SKU
    }
    
    response = client.post('/api/products',
                          data=json.dumps(duplicate_data),
                          headers=auth_headers)
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'sku' in data['errors']
    assert 'already exists' in data['errors']['sku'].lower()

# File Validation Tests
def test_file_upload_validation(client, auth_headers):
    """Test validation for file uploads"""
    from io import BytesIO
    
    # Test with empty file
    empty_file = BytesIO(b'')
    response = client.post('/api/products/1/image',
                          data={'file': (empty_file, 'empty.jpg')},
                          headers={'Authorization': auth_headers['Authorization']},
                          content_type='multipart/form-data')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'file' in data['errors']
    
    # Test with invalid file type
    text_file = BytesIO(b'This is not an image')
    response = client.post('/api/products/1/image',
                          data={'file': (text_file, 'not_image.txt')},
                          headers={'Authorization': auth_headers['Authorization']},
                          content_type='multipart/form-data')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'file' in data['errors']
    assert 'type' in data['errors']['file'].lower()
    
    # Test with file that's too large
    large_file = BytesIO(b'0' * 5 * 1024 * 1024)  # 5MB file (assuming limit is lower)
    response = client.post('/api/products/1/image',
                          data={'file': (large_file, 'large.jpg')},
                          headers={'Authorization': auth_headers['Authorization']},
                          content_type='multipart/form-data')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'errors' in data
    assert 'file' in data['errors']
    assert 'size' in data['errors']['file'].lower()