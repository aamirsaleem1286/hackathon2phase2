import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.auth.utils import create_access_token
from backend.database.session import engine
from backend.database.models import User, Task
from sqlmodel import Session, select
from datetime import timedelta

client = TestClient(app)


def test_create_task_with_authentication():
    """Test creating a task with valid authentication"""
    # First register and login a user to get a token
    client.post(
        "/api/auth/register",
        json={
            "email": "taskuser@example.com",
            "password": "password123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "taskuser@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]

    # Create a task with the token
    response = client.post(
        "/api/tasks",
        json={
            "title": "Test Task",
            "description": "This is a test task"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["title"] == "Test Task"
    assert data["description"] == "This is a test task"


def test_get_tasks_with_authentication():
    """Test getting tasks with valid authentication"""
    # First register and login a user to get a token
    client.post(
        "/api/auth/register",
        json={
            "email": "gettaskuser@example.com",
            "password": "password123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "gettaskuser@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]

    # Create a task first
    client.post(
        "/api/tasks",
        json={
            "title": "Test Task",
            "description": "This is a test task"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    # Get tasks
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "tasks" in data
    assert len(data["tasks"]) >= 1


def test_update_task_with_authentication():
    """Test updating a task with valid authentication"""
    # First register and login a user to get a token
    client.post(
        "/api/auth/register",
        json={
            "email": "updatetaskuser@example.com",
            "password": "password123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "updatetaskuser@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]

    # Create a task first
    create_response = client.post(
        "/api/tasks",
        json={
            "title": "Original Task",
            "description": "Original description"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    # Update the task
    response = client.put(
        f"/api/tasks/{task_id}",
        json={
            "title": "Updated Task",
            "description": "Updated description"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated description"


def test_delete_task_with_authentication():
    """Test deleting a task with valid authentication"""
    # First register and login a user to get a token
    client.post(
        "/api/auth/register",
        json={
            "email": "deletetaskuser@example.com",
            "password": "password123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "deletetaskuser@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]

    # Create a task first
    create_response = client.post(
        "/api/tasks",
        json={
            "title": "Task to delete",
            "description": "Will be deleted"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True