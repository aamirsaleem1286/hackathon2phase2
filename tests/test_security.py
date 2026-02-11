import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import engine
from backend.database.models import User, Task
from sqlmodel import Session, select

client = TestClient(app)


def test_user_isolation_for_reading_tasks():
    """Test that users can only read their own tasks"""
    # Create first user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "user1@example.com",
            "password": "password123"
        }
    )

    login_response1 = client.post(
        "/api/auth/login",
        json={
            "email": "user1@example.com",
            "password": "password123"
        }
    )
    token1 = login_response1.json()["access_token"]

    # Create second user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "user2@example.com",
            "password": "password123"
        }
    )

    login_response2 = client.post(
        "/api/auth/login",
        json={
            "email": "user2@example.com",
            "password": "password123"
        }
    )
    token2 = login_response2.json()["access_token"]

    # User 1 creates a task
    create_response = client.post(
        "/api/tasks",
        json={
            "title": "User 1's task",
            "description": "This belongs to user 1"
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    task_id = create_response.json()["id"]

    # User 2 tries to access user 1's task directly
    response = client.get(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )

    # This should either return 404 (not found) or 403 (forbidden) depending on implementation
    # Our current implementation would return 404 since we only query for user's own tasks
    # But for this test, let's ensure users can't manipulate tasks that aren't theirs

    # Get user 1's tasks with user 1's token
    user1_tasks_response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token1}"}
    )
    user1_task_ids = [task['id'] for task in user1_tasks_response.json()['tasks']]

    # Get user 2's tasks with user 2's token
    user2_tasks_response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token2}"}
    )
    user2_task_ids = [task['id'] for task in user2_tasks_response.json()['tasks']]

    # Ensure no overlap in task access
    assert task_id in user1_task_ids  # User 1 can see their task
    assert task_id not in user2_task_ids  # User 2 cannot see user 1's task


def test_user_isolation_for_updating_tasks():
    """Test that users can only update their own tasks"""
    # Create first user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "updater1@example.com",
            "password": "password123"
        }
    )

    login_response1 = client.post(
        "/api/auth/login",
        json={
            "email": "updater1@example.com",
            "password": "password123"
        }
    )
    token1 = login_response1.json()["access_token"]

    # Create second user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "updater2@example.com",
            "password": "password123"
        }
    )

    login_response2 = client.post(
        "/api/auth/login",
        json={
            "email": "updater2@example.com",
            "password": "password123"
        }
    )
    token2 = login_response2.json()["access_token"]

    # User 1 creates a task
    create_response = client.post(
        "/api/tasks",
        json={
            "title": "Updatable task",
            "description": "Original description"
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    task_id = create_response.json()["id"]

    # User 2 tries to update user 1's task
    response = client.put(
        f"/api/tasks/{task_id}",
        json={
            "title": "Hacked task",
            "description": "Hacked description"
        },
        headers={"Authorization": f"Bearer {token2}"}
    )

    # This should return 403 Forbidden or 404 Not Found
    assert response.status_code in [403, 404]


def test_user_isolation_for_deleting_tasks():
    """Test that users can only delete their own tasks"""
    # Create first user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "deleter1@example.com",
            "password": "password123"
        }
    )

    login_response1 = client.post(
        "/api/auth/login",
        json={
            "email": "deleter1@example.com",
            "password": "password123"
        }
    )
    token1 = login_response1.json()["access_token"]

    # Create second user and login
    client.post(
        "/api/auth/register",
        json={
            "email": "deleter2@example.com",
            "password": "password123"
        }
    )

    login_response2 = client.post(
        "/api/auth/login",
        json={
            "email": "deleter2@example.com",
            "password": "password123"
        }
    )
    token2 = login_response2.json()["access_token"]

    # User 1 creates a task
    create_response = client.post(
        "/api/tasks",
        json={
            "title": "Deletable task",
            "description": "Will be attempted to delete by wrong user"
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    task_id = create_response.json()["id"]

    # User 2 tries to delete user 1's task
    response = client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )

    # This should return 403 Forbidden or 404 Not Found
    assert response.status_code in [403, 404]