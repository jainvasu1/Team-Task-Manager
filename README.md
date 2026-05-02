# TaskFlow — Team Task Manager

A full-stack web app for managing projects and tasks across a team, built with role-based access so admins and members each see only what they need.

## Tech used

Backend is Node.js with Express and MongoDB. Frontend is React (Vite) with TailwindCSS. Auth is JWT stored in localStorage.

## How to run locally

You need Node.js and a MongoDB Atlas connection string.

**Backend**

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with these values:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Then start the server:

```bash
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in the browser.

## Demo credentials

Sign up at `/signup`. Set role to **Admin** to get full access (create projects, tasks, manage members). Members can view and update task status only.

## Features

- Signup and login with JWT auth
- Projects: create, view, delete, manage members
- Tasks: create with priority and due date, assign to members, move between Todo / In Progress / Done
- Dashboard showing task status breakdown and overdue count
- Team page listing all workspace members with roles
- Role-based access throughout — admin-only actions are hidden from members
