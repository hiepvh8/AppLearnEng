from fastapi.testclient import TestClient
from main import app
import pytest
from database.database import Base, engine
from models import models

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["is_active"] == True

def test_register_duplicate_user():
    # Register first user
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    
    # Try to register same user again
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 400

def test_login_user():
    # Register user first
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    
    # Try to login
    response = client.post(
        "/api/auth/token",
        data={
            "username": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password():
    # Register user first
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    
    # Try to login with wrong password
    response = client.post(
        "/api/auth/token",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401 