import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import engine
from backend.database.models import User, Task
from sqlmodel import Session, select

client = TestClient(app)


def test_complete_user_workflow():
    """Test complete user workflow: register, login, create tasks, update, delete"""
    # Step 1: Register a new user
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "e2etest@example.com",
            "password": "securepassword123"
        }
    )
    assert register_response.status_code == 200
    register_data = register_response.json()
    assert "id" in register_data
    assert register_data["email"] == "e2etest@example.com"

    # Step 2: Login with the registered user
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "e2etest@example.com",
            "password": "securepassword123"
        }
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"

    token = login_data["access_token"]

    # Step 3: Create a new task
    create_task_response = client.post(
        "/api/tasks",
        json={
            "title": "First E2E Task",
            "description": "Testing the complete workflow"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_task_response.status_code == 200
    task_data = create_task_response.json()
    assert "id" in task_data
    task_id = task_data["id"]
    assert task_data["title"] == "First E2E Task"
    assert task_data["description"] == "Testing the complete workflow"
    assert task_data["completed"] is False

    # Step 4: Get the user's tasks
    get_tasks_response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_tasks_response.status_code == 200
    tasks_data = get_tasks_response.json()
    assert "tasks" in tasks_data
    assert len(tasks_data["tasks"]) >= 1

    # Find our created task in the list
    user_tasks = tasks_data["tasks"]
    user_task = next((t for t in user_tasks if t["id"] == task_id), None)
    assert user_task is not None
    assert user_task["title"] == "First E2E Task"

    # Step 5: Update the task
    update_task_response = client.put(
        f"/api/tasks/{task_id}",
        json={
            "title": "Updated E2E Task",
            "description": "Workflow test updated"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_task_response.status_code == 200
    updated_task_data = update_task_response.json()
    assert updated_task_data["title"] == "Updated E2E Task"
    assert updated_task_data["description"] == "Workflow test updated"

    # Step 6: Toggle task completion
    toggle_response = client.patch(
        f"/api/tasks/{task_id}/toggle-complete",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert toggle_response.status_code == 200
    toggled_task_data = toggle_response.json()
    assert toggled_task_data["completed"] is True

    # Step 7: Delete the task
    delete_response = client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 200
    delete_data = delete_response.json()
    assert delete_data["success"] is True

    # Step 8: Verify the task is gone
    get_tasks_after_delete = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_tasks_after_delete.status_code == 200
    remaining_tasks_data = get_tasks_after_delete.json()
    remaining_task = next((t for t in remaining_tasks_data["tasks"] if t["id"] == task_id), None)
    assert remaining_task is None

    print("✅ Complete end-to-end workflow test passed!")