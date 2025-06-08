"""
Test cases for FastAPI Static Website
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    """Test the main page endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to FastAPI Static Website" in response.text

def test_about_page():
    """Test the about page endpoint"""
    response = client.get("/about")
    assert response.status_code == 200
    assert "About This Project" in response.text

def test_contact_page():
    """Test the contact page endpoint"""
    response = client.get("/contact")
    assert response.status_code == 200
    assert "Contact Information" in response.text

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data

def test_static_files():
    """Test static file serving"""
    response = client.get("/static/css/style.css")
    assert response.status_code == 200
    assert "text/css" in response.headers["content-type"]

def test_nonexistent_page():
    """Test 404 for nonexistent pages"""
    response = client.get("/nonexistent")
    assert response.status_code == 404

