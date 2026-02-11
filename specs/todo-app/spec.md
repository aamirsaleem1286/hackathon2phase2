# Phase II Todo App - Specification

## Overview
Build a full-stack todo application with multi-user support, authentication, and CRUD operations using modern web technologies.

## Features
- Multi-user todo list management
- User authentication using Better Auth with JWT
- Todo task CRUD operations (Create, Read, Update, Delete)
- Task completion toggling
- User isolation - users can only access their own tasks

## Tech Stack
- Backend: FastAPI
- Frontend: Next.js with App Router
- Authentication: Better Auth
- Database: Neon PostgreSQL
- ORM: SQLModel
- Authentication: JWT tokens

## User Stories
1. As a user, I want to register and log into the application securely
2. As a logged-in user, I want to create new todo tasks
3. As a logged-in user, I want to view my todo tasks
4. As a logged-in user, I want to update my todo tasks (including completion status)
5. As a logged-in user, I want to delete my todo tasks
6. As a user, I should not be able to access other users' tasks

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle-complete` - Toggle task completion

## Data Models
### User
- id (UUID/Integer)
- email (String)
- password_hash (String)
- created_at (DateTime)

### Task
- id (UUID/Integer)
- title (String)
- description (Text, optional)
- completed (Boolean, default: false)
- user_id (Foreign Key to User)
- created_at (DateTime)
- updated_at (DateTime)

## Authentication Flow
1. User registers/login via Better Auth
2. JWT token is issued upon successful authentication
3. JWT token must be included in Authorization header for protected endpoints
4. Backend verifies token authenticity and extracts user identity

## Security Requirements
- All API endpoints require authentication except auth endpoints
- Users can only access their own tasks
- Proper error handling for unauthorized access (401, 403)
- Passwords must be properly hashed

## Frontend Requirements
- Responsive UI using Next.js App Router
- Server components by default, client components for interactivity
- Centralized API client with automatic JWT attachment
- Task listing, creation, editing, and deletion interfaces
- Login/Register forms