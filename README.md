# TaskFlow — Team Task Manager

Full-stack web app for project & task management with role-based access (Admin/Member).

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** React (Vite), TailwindCSS, React Router, Axios
- **Deployment:** Railway

## Structure
```
backend/   Express REST API
frontend/  React SPA
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- Auth (signup/login) with JWT
- Project CRUD, member management
- Task creation, assignment, status tracking
- Dashboard with overdue & status stats
- Role-based access (Admin/Member)
