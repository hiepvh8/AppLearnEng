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

def test_create_vocabulary():
    response = client.post(
        "/api/vocab/",
        json={
            "word": "test",
            "meaning": "kiểm tra",
            "example": "This is a test example",
            "category": "TOEIC",
            "language": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["word"] == "test"
    assert data["meaning"] == "kiểm tra"
    assert data["category"] == "TOEIC"

def test_get_vocabularies():
    # Create a vocabulary first
    client.post(
        "/api/vocab/",
        json={
            "word": "test",
            "meaning": "kiểm tra",
            "example": "This is a test example",
            "category": "TOEIC",
            "language": "en"
        }
    )
    
    response = client.get("/api/vocab/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["word"] == "test"

def test_get_vocabulary_by_category():
    # Create vocabularies
    client.post(
        "/api/vocab/",
        json={
            "word": "test1",
            "meaning": "kiểm tra 1",
            "example": "Example 1",
            "category": "TOEIC",
            "language": "en"
        }
    )
    client.post(
        "/api/vocab/",
        json={
            "word": "test2",
            "meaning": "kiểm tra 2",
            "example": "Example 2",
            "category": "IELTS",
            "language": "en"
        }
    )
    
    response = client.get("/api/vocab/?category=TOEIC")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "TOEIC"

def test_get_categories():
    # Create vocabularies with different categories
    client.post(
        "/api/vocab/",
        json={
            "word": "test1",
            "meaning": "kiểm tra 1",
            "example": "Example 1",
            "category": "TOEIC",
            "language": "en"
        }
    )
    client.post(
        "/api/vocab/",
        json={
            "word": "test2",
            "meaning": "kiểm tra 2",
            "example": "Example 2",
            "category": "IELTS",
            "language": "en"
        }
    )
    
    response = client.get("/api/vocab/categories/")
    assert response.status_code == 200
    data = response.json()
    assert "TOEIC" in data
    assert "IELTS" in data 