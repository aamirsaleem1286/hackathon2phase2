# Spec Constitution (SP-Constitution)

This document defines the binding rules, constraints, and decision principles for Phase II of the Todo Full-Stack Web Application. All agents (human or AI) must follow this constitution strictly. Any change requires an explicit spec update.

## 1. Authority & Source of Truth

The Specs folder (/specs/**) is the single source of truth.

If implementation, discussion, or assumptions conflict with specs, specs always win.

CLAUDE.md files define how to work, not what to build.

No feature, field, endpoint, or behavior may be added without an explicit spec reference or spec update.

## 2. Scope Boundary (Phase II)

Phase II is limited to:

Todo Task CRUD (multi-user)

Authentication using Better Auth with JWT

REST API with FastAPI

Persistent storage using Neon PostgreSQL

Responsive web UI using Next.js App Router

Explicitly out of scope:

Chatbot / AI features

Background jobs

Notifications

Role-based access control (RBAC)

Admin features

## 3. Spec-Driven Development Rules

Every change follows this order: Spec → Plan → Tasks → Implementation → Review

Implementation without reading specs is invalid.

If a requirement is unclear, agents must:

Pause implementation

Flag ambiguity

Propose a spec clarification

Specs may evolve, but only through explicit updates, never silently.

## 4. Agent Responsibility Constitution

Each agent has a non-overlapping, exclusive scope:

Spec Analyst: Interpretation only, no design or code

System Architect: Architecture only, no implementation

API Design Agent: Contract definition only

Auth & Security Agent: Security rules only

Database Agent: Schema & data rules only

Backend Agent: FastAPI implementation only

Frontend Agent: Next.js UI & integration only

Spec-Kit Workflow Agent: Process enforcement only

No agent may override another agent's domain without a spec change.

## 5. Authentication & Identity Rules

All API requests must be authenticated after login.

JWT is the only accepted auth mechanism between frontend and backend.

JWT must:

Be issued by Better Auth

Be sent via Authorization: Bearer <token>

Backend must:

Verify token signature

Validate expiry

Extract user identity from token

Unauthenticated requests receive 401 Unauthorized.

## 6. User Isolation & Data Ownership

Every task belongs to exactly one user.

Users may only:

Read their own tasks

Create tasks for themselves

Update their own tasks

Delete their own tasks

Task ownership is enforced:

At query level

At update/delete level

At completion toggle

Cross-user access is strictly forbidden.

## 7. API Behavior Constitution

All routes live under /api/.

Endpoints remain stable as defined in specs.

Backend must ignore any user_id mismatch between:

URL parameter

JWT payload

Error handling is standardized:

401: Missing or invalid token

403: Valid token, forbidden action

404: Resource not found (within user scope)

## 8. Database & Persistence Rules

Neon PostgreSQL is the only persistence layer.

ORM usage is mandatory (SQLModel).

Direct SQL is discouraged unless justified by spec.

Schema rules:

tasks.user_id is mandatory

Indexes exist on user_id and completed

No shared sessions between frontend and backend.

## 9. Frontend Rules

Next.js App Router is mandatory.

Server components are default.

Client components only for interactivity.

API access must go through a centralized API client.

JWT must be attached automatically to every request.

## 10. Environment & Secrets

Shared secret (BETTER_AUTH_SECRET) must be:

Present in frontend env

Present in backend env

Secrets are never hardcoded.

Environment-specific behavior must be explicit.

## 11. Change Management Rules

Any new requirement requires:

Spec update

Agent re-review

No silent scope creep.

All deviations must be documented.

## 12. Definition of Done (Phase II)

Phase II is considered complete only if:

All specs are implemented

Auth is enforced on all endpoints

User isolation is verified

Frontend and backend align with API contract

No agent violated scope boundaries
