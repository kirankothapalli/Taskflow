# TaskFlow — Project Management Platform

Full-stack MERN project management app with Kanban boards, analytics, JWT auth, and real-time updates.

## Features
- JWT Authentication (Register / Login)
- Project Management (Create, Edit, Delete, Progress tracking)
- Drag-and-drop Kanban Board (Todo / In Progress / Completed)
- Task assignment with priority levels
- Dashboard with charts (Recharts)
- Dark mode
- Socket.IO real-time sync
- Fully responsive (mobile + desktop)

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Realtime | Socket.IO |
| Charts | Recharts |
| DnD | @hello-pangea/dnd |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Backend
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env

# Frontend
cd ../client
npm install
cp .env.example .env
# VITE_API_URL is pre-configured for local dev
```

### 2. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit: http://localhost:3000

---

## Deployment

### Backend → Render

1. Push `server/` folder to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a random 64-char string
   - `CLIENT_URL` — your Vercel frontend URL
   - `PORT` — 5000

### Frontend → Vercel

1. Push `client/` folder to GitHub
2. Create new project on [vercel.com](https://vercel.com)
3. Framework: Vite
4. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api`
5. Deploy

### Database → MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster (M0)
3. Create DB user, whitelist `0.0.0.0/0`
4. Copy connection string to `MONGO_URI`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/tasks | Get tasks (filterable) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/dashboard | Dashboard stats |

---

## Folder Structure

```
taskflow/
├── server/
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middleware/      # JWT auth middleware
│   └── server.js       # Entry point
└── client/
    └── src/
        ├── components/ # Reusable UI components
        ├── pages/      # Route pages
        ├── context/    # React Context (Auth, Theme)
        └── services/   # Axios API calls
```

---

## GitLab Push

```bash
git init
git add .
git commit -m "feat: initial TaskFlow implementation"
git remote add origin https://gitlab.com/<your-username>/taskflow.git
git push -u origin main
```

---

Built for internship submission — production-ready MERN stack.
