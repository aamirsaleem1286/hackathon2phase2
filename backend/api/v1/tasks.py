from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database.session import engine
from database.models import Task, User
from schemas.task import TaskCreate, TaskUpdate, TaskToggleComplete, TaskRead, TaskListResponse
from auth.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=TaskListResponse)
def get_tasks(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        # Only return tasks belonging to the current user
        user_tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
        return TaskListResponse(tasks=user_tasks)


@router.post("/", response_model=TaskRead)
def create_task(task_data: TaskCreate, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        # Create task for the current user
        task = Task(
            title=task_data.title,
            description=task_data.description,
            user_id=current_user.id
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_data: TaskUpdate, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        # Retrieve the task
        task = session.get(Task, task_id)

        # Verify that the task belongs to the current user
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if task.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this task"
            )

        # Update the task with provided data
        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Update the timestamp
        task.updated_at = datetime.utcnow()  # Updated at now

        session.add(task)
        session.commit()
        session.refresh(task)

        return task


@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        # Retrieve the task
        task = session.get(Task, task_id)

        # Verify that the task belongs to the current user
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if task.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this task"
            )

        session.delete(task)
        session.commit()

        return {"success": True}


@router.patch("/{task_id}/toggle-complete", response_model=TaskRead)
def toggle_task_complete(task_id: int, toggle_data: TaskToggleComplete = None, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        # Retrieve the task
        task = session.get(Task, task_id)

        # Verify that the task belongs to the current user
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if task.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this task"
            )

        # Toggle the completed status
        if toggle_data and toggle_data.completed is not None:
            task.completed = toggle_data.completed
        else:
            task.completed = not task.completed  # Toggle the current value

        task.updated_at = datetime.utcnow()  # Updated at now

        session.add(task)
        session.commit()
        session.refresh(task)

        return task