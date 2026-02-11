# Phase II Todo App - Implementation Plan

## Architecture Overview
The application follows a modern full-stack architecture with separation of concerns:

```
[Frontend - Next.js] <-> [API Layer - FastAPI] <-> [Authentication - Better Auth] <-> [Database - Neon PostgreSQL]
```

## Tech Stack Details
- **Frontend Framework**: Next.js 14+ with App Router
- **Backend Framework**: FastAPI
- **Authentication**: Better Auth with JWT
- **Database**: Neon PostgreSQL
- **ORM**: SQLModel
- **UI Styling**: Tailwind CSS or similar

## Database Schema
### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

## API Contract

### Authentication Endpoints
- `POST /api/auth/register`
  - Request: `{email: string, password: string}`
  - Response: `{success: boolean, token?: string, user?: User}`

- `POST /api/auth/login`
  - Request: `{email: string, password: string}`
  - Response: `{success: boolean, token: string, user?: User}`

### Task Endpoints
- `GET /api/tasks`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{tasks: Task[]}`

- `POST /api/tasks`
  - Headers: `Authorization: Bearer <token>`
  - Request: `{title: string, description?: string}`
  - Response: `{task: Task}`

- `PUT /api/tasks/{id}`
  - Headers: `Authorization: Bearer <token>`
  - Request: `{title?: string, description?: string, completed?: boolean}`
  - Response: `{task: Task}`

- `DELETE /api/tasks/{id}`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{success: boolean}`

- `PATCH /api/tasks/{id}/toggle-complete`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{task: Task}`

## File Structure
```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration settings
├── database/
│   ├── __init__.py
│   ├── models.py        # SQLAlchemy/SQLModel models
│   └── session.py       # Database session management
├── auth/
│   ├── __init__.py
│   ├── deps.py          # Authentication dependencies
│   └── utils.py         # Authentication utilities
├── api/
│   ├── __init__.py
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── auth.py      # Authentication endpoints
│   │   └── tasks.py     # Task endpoints
└── schemas/             # Pydantic schemas
    ├── __init__.py
    ├── user.py
    └── task.py

frontend/
├── package.json
├── next.config.js
├── tsconfig.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── api/
│       └── auth/
│           └── [auth].ts    # Better Auth API routes
├── components/
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   └── TaskForm.tsx
├── lib/
│   ├── api.ts           # API client
│   └── auth.ts          # Authentication utilities
└── styles/
    └── globals.css
```

## Implementation Approach

### Phase 1: Project Setup
1. Initialize backend project with FastAPI
2. Initialize frontend project with Next.js
3. Set up database connection with Neon PostgreSQL
4. Configure authentication with Better Auth

### Phase 2: Authentication System
1. Implement user registration/login endpoints
2. Set up JWT token generation and validation
3. Create authentication middleware
4. Test authentication flow

### Phase 3: Task Management
1. Define task models and database schema
2. Implement task CRUD endpoints
3. Enforce user isolation at database/api level
4. Add task completion toggle functionality

### Phase 4: Frontend Integration
1. Create frontend components for task management
2. Integrate with backend API
3. Implement authentication UI
4. Add responsive design

### Phase 5: Testing & Polish
1. Write unit tests for backend endpoints
2. Add integration tests
3. Perform security validation
4. Optimize performance

## Security Measures
- JWT tokens for stateless authentication
- Database-level foreign key constraints for user isolation
- Input validation using Pydantic schemas
- Rate limiting considerations
- Password hashing using bcrypt

## Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for JWT signing
- `BETTER_AUTH_URL`: Base URL for auth