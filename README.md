# JOBFOR — AI-Powered Job Search Assistant

A full-stack monorepo combining a **React** frontend and an **Express + TypeScript** backend, with a **Python ML** service for smart job recommendations.

---

## 📁 Project Structure

```
JOBFOR/
├── frontend/          # Vite + React 19 — runs on :3000
│   └── src/
├── backend/           # Express + TypeScript — runs on :3001
│   ├── src/
│   ├── ml/            # Python Flask ML service — runs on :5000
│   └── prisma/        # Database schema & migrations
├── package.json       # Root workspace config
├── .env.example       # Unified environment variables template
└── docker-compose.yml # Full-stack Docker setup
```

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- Node.js ≥ 20
- Python ≥ 3.9 (for ML service)
- PostgreSQL & Redis (or use Docker Compose below)

### 2. Install Dependencies
```powershell
# From the root — installs frontend + backend at once
npm install
```

### 3. Set Up Environment Variables
```powershell
Copy-Item .env.example .env
# Then open .env and fill in your values
```

### 4. Start Databases (Docker)
```powershell
docker-compose up postgres redis -d
```

### 5. Run Database Migrations
```powershell
npm run db:generate
npm run db:migrate
```

### 6. Start Frontend + Backend Together
```powershell
npm run dev
```
> This starts both **Vite** (`:3000`) and **Express** (`:3001`) concurrently with color-coded logs.

### 7. (Optional) Start the Python ML Service
```powershell
cd backend/ml
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py           # Runs on :5000
```

---

## 📜 Available Scripts (from root)

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend together |
| `npm run dev:frontend` | Start only the frontend (Vite) |
| `npm run dev:backend` | Start only the backend (Node) |
| `npm run build` | Build both frontend and backend |
| `npm run test` | Run backend tests (Jest) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---

## 🐳 Docker (Full Stack)

```powershell
# Start everything (postgres, redis, api, frontend)
docker-compose up --build
```

---

## 🌐 Ports

| Service | Port |
|---|---|
| Frontend (Vite) | `3000` |
| Backend (Express) | `3001` |
| ML Service (Python) | `5000` |
| PostgreSQL | `5432` |
| Redis | `6379` |

> **Proxy**: In development, the React app automatically proxies `/api/*` requests to `http://localhost:3001` — no CORS configuration needed.

---

## 🔑 Tech Stack

**Frontend**: React 19, Vite, React Router, Recharts  
**Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT, Passport.js  
**ML Service**: Python, Flask, scikit-learn, spaCy  
**Database**: PostgreSQL, Redis  
**Infrastructure**: Docker, Cloudinary, Nodemailer, OpenAI
