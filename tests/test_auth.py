import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import engine
from backend.database.models import User
from backend.schemas.user import UserCreate
from sqlmodel import Session, select

client = TestClient(app)


def test_register_new_user():
    """Test registering a new user"""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["email"] == "test@example.com"


def test_login_with_valid_credentials():
    """Test login with valid credentials"""
    # First register a user
    client.post(
        "/api/auth/register",
        json={
            "email": "login_test@example.com",
            "password": "password123"
        }
    )

    # Then try to log in
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login_test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401