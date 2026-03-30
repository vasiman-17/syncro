# Syncro Pro

Syncro is a developer collaboration platform where users can post projects, apply as teammates, and manage applications.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt

## Folder Structure

- `frontend/` React app (dashboard style UI + API calls)
- `backend/` Express API (auth, projects, applications)

## Setup

### 1) Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Update values (`MONGO_URI`, `JWT_SECRET`)
3. Run:
   - `cd backend`
   - `npm install`
   - `npm run seed:demo` (optional demo data)
   - `npm run dev`

### 2) Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## API Overview

Base URL: `http://localhost:5000/api`

Use header for protected routes:

`Authorization: Bearer <token>`

### Health

- `GET /health`

Example:

```bash
curl http://localhost:5000/api/health
```

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/me`

Example signup:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vaibhav",
    "email": "vaibhav@example.com",
    "password": "secret123",
    "skills": ["React", "Node"],
    "github": "https://github.com/vaibhav",
    "role": "developer"
  }'
```

### Projects

- `GET /projects?search=&skill=&tech=`
- `GET /projects/:id`
- `GET /projects/mine`
- `POST /projects`
- `PUT /projects/:id`
- `PATCH /projects/:id/status`
- `DELETE /projects/:id`
- `POST /projects/:id/apply`

Example create project:

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Syncro Chat",
    "description": "Build realtime team chat",
    "requiredSkills": ["Node", "Socket.io"],
    "techStack": ["Express", "MongoDB"],
    "tags": ["collaboration", "chat"],
    "difficulty": "intermediate"
  }'
```

### Applications

- `GET /applications/mine`
- `GET /applications/applied-by-me`
- `PATCH /applications/:id/status`
- `DELETE /applications/:id/withdraw`

Example update status:

```bash
curl -X PATCH http://localhost:5000/api/applications/<applicationId>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status":"accepted"}'
```

### Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`

Example mark read:

```bash
curl -X PATCH http://localhost:5000/api/notifications/<notificationId>/read \
  -H "Authorization: Bearer <token>"
```

### Bookmarks

- `GET /bookmarks`
- `POST /bookmarks`
- `DELETE /bookmarks/:id`

Example add bookmark:

```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"projectId":"<projectId>"}'
```

### Matching (AI-ready foundations)

- `GET /matching/teammates`
- `GET /matching/projects`

Example suggestions:

```bash
curl http://localhost:5000/api/matching/teammates \
  -H "Authorization: Bearer <token>"
```

## Frontend Routes

- `/auth`
- `/dashboard`
- `/projects`
- `/projects/:id`
- `/applications`
- `/notifications`
- `/discover`
- `/profile`

## Quick End-To-End Demo

1. Run backend demo seed:

```bash
cd backend
npm run seed:demo
```

2. Start backend + frontend:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

3. Login from two different devices or browsers:
   - User A (owner): `owner@syncro.dev` / `secret123`
   - User B (applicant): `applicant@syncro.dev` / `secret123`
4. Device B applies to an open project.
5. Device A accepts/rejects in Applications page.
6. Device B sees updated status and notification.

## Render Deployment Notes

- Set backend env vars:
  - `PORT=10000` (or Render default)
  - `MONGO_URI=<your production mongo uri>`
  - `JWT_SECRET=<long-random-secret>`
- Set frontend env var:
  - `VITE_API_URL=https://<your-backend-domain>/api`
- Deploy backend as web service and frontend as static site.
