# 🏋️ Daily Exercise Tracker

A modern full-stack fitness tracking application built with **React**, **Node.js**, **Express**, **MongoDB**, **Docker**, and **Docker Compose**.

---

## ✨ Features

- **User Authentication** — Register, login with JWT, bcrypt password hashing
- **Exercise Logging** — Add, edit, delete workouts (Running, Pushups, Cycling, Yoga, Gym, Walking)
- **Goal Tracking** — Set targets, track progress, view completion percentage
- **Dashboard** — Total workouts, calories burned, streak count, recent workouts
- **Dark / Light Theme** — Toggle with a single click
- **Responsive Design** — Mobile-friendly layout

---

## 🗂️ Project Structure

```
daily-exercise-tracker/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── server.js       # Entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar, Sidebar, ProtectedRoute
│   │   ├── context/    # AuthContext
│   │   ├── pages/      # Dashboard, Login, Register, History, Goals
│   │   ├── services/   # Axios API service
│   │   ├── App.jsx
│   │   └── index.css
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env.example
├── .github/
│   └── workflows/
│       └── ci-cd.yml   # GitHub Actions pipeline
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start — Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run with a single command

```bash
# Clone or navigate to the project
cd daily-exercise-tracker

# Build and start all services
docker-compose up --build
```

The app will be available at:
| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:5000/api    |
| MongoDB  | mongodb://localhost:27017    |

### Stop the app
```bash
docker-compose down
```

### Stop and remove all data (volumes)
```bash
docker-compose down -v
```

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally or [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Backend

```bash
cd backend
npm install

# Copy env file and edit values
cp .env.example .env
# Set MONGO_URI to your local MongoDB: mongodb://localhost:27017/exercise-tracker

npm run dev
# Backend runs at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install

# Copy env file
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

npm run dev
# Frontend runs at http://localhost:3000
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=mongodb://mongo:27017/exercise-tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint              | Description       | Auth |
|--------|-----------------------|-------------------|------|
| POST   | /api/auth/register    | Register new user | ❌   |
| POST   | /api/auth/login       | Login user        | ❌   |
| GET    | /api/auth/profile     | Get user profile  | ✅   |

### Workouts
| Method | Endpoint              | Description          | Auth |
|--------|-----------------------|----------------------|------|
| GET    | /api/workouts         | Get all workouts     | ✅   |
| POST   | /api/workouts         | Add new workout      | ✅   |
| PUT    | /api/workouts/:id     | Update workout       | ✅   |
| DELETE | /api/workouts/:id     | Delete workout       | ✅   |
| GET    | /api/workouts/stats   | Get dashboard stats  | ✅   |

### Goals
| Method | Endpoint          | Description      | Auth |
|--------|-------------------|------------------|------|
| GET    | /api/goals        | Get all goals    | ✅   |
| POST   | /api/goals        | Create goal      | ✅   |
| PUT    | /api/goals/:id    | Update progress  | ✅   |
| DELETE | /api/goals/:id    | Delete goal      | ✅   |

---

## 🐳 Docker Images

| Service  | Base Image       | Size   |
|----------|------------------|--------|
| Backend  | node:20-alpine   | ~180MB |
| Frontend | nginx:alpine     | ~45MB  |
| Database | mongo:7          | ~700MB |

---

## ⚙️ GitHub Actions CI/CD

The pipeline in `.github/workflows/ci-cd.yml` automatically:

1. **On every push/PR** — Installs dependencies and runs tests
2. **On push to `main`** — Builds and pushes Docker images to Docker Hub

### Setup Docker Hub Secrets

Add these secrets in your GitHub repository (**Settings → Secrets → Actions**):

| Secret Name          | Value                        |
|----------------------|------------------------------|
| `DOCKER_HUB_USERNAME`| Your Docker Hub username     |
| `DOCKER_HUB_TOKEN`   | Your Docker Hub access token |

---

## 🏗️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router 6, Axios   |
| Styling   | Vanilla CSS (glassmorphism theme) |
| Backend   | Node.js, Express                  |
| Database  | MongoDB, Mongoose                 |
| Auth      | JWT, bcryptjs                     |
| DevOps    | Docker, Docker Compose            |
| CI/CD     | GitHub Actions                    |

---

## 📝 License

MIT — free to use and modify.
