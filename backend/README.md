# 🚀 Job Search Assistant — Backend API

A production-ready Node.js/TypeScript REST API powering an AI-driven job search platform. Aggregates jobs from **5 APIs**, provides **GPT-4 powered career coaching**, hybrid ML recommendations, and full application lifecycle tracking.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [ML Service](#ml-service)
- [Testing](#testing)
- [Deployment](#deployment)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Email/password + OAuth (Google, GitHub). JWT access + refresh tokens, bcrypt hashing, password reset via email |
| 👤 **Profile** | Skills (proficiency + years), work experience, education, certifications, resume upload, completion % |
| 🔍 **Job Search** | Aggregates **5 APIs** in parallel: Adzuna, JSearch, Remotive, The Muse, Arbeitnow. Deduplication, caching, filtering |
| 🤖 **AI Recommendations** | Hybrid engine: Content-Based (60%) + Collaborative (25%) + Knowledge-Based (15%). TF-IDF + Cosine + Jaccard similarity |
| 🧠 **AI Career Coach** | GPT-4 powered: chat, resume review (scored), cover letter generator, interview prep, salary negotiation, career path guidance |
| 📊 **Market Insights** | Salary benchmarks, skill demand trends, skill gap analysis, company insights with mass-hiring detection |
| 📁 **Applications** | Save jobs (folders, tags, notes), track status (Applied → Viewed → Screening → Interviewing → Offered), Kanban-ready data |
| 🔔 **Notifications** | Create, list, mark-read, delete in-app notifications |
| 🚨 **Job Alerts** | CRUD job alerts with configurable frequency (daily/weekly/instant) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20 LTS |
| **Framework** | Express.js 4.x |
| **Language** | TypeScript 5.x |
| **ORM** | Prisma (PostgreSQL) |
| **Validation** | Zod |
| **Auth** | JWT + Passport.js (Google, GitHub OAuth) |
| **AI** | OpenAI GPT-4 API |
| **Caching** | Redis |
| **Email** | Nodemailer (SMTP) |
| **File Upload** | Multer |
| **Rate Limiting** | express-rate-limit |
| **ML Service** | Python 3.11 + Flask (separate process) |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # 15 database models
├── src/
│   ├── config/                # DB, Redis, Passport, env validation
│   ├── controllers/           # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── job.controller.ts
│   │   ├── application.controller.ts
│   │   ├── aiCoach.controller.ts
│   │   ├── insights.controller.ts
│   │   └── notification.controller.ts
│   ├── services/              # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── jobApi.service.ts          # 5 API aggregation
│   │   ├── recommendation.service.ts  # Hybrid ML engine
│   │   ├── aiCoach.service.ts         # GPT-4 coaching
│   │   ├── applications.service.ts
│   │   ├── marketInsights.service.ts
│   │   ├── email.service.ts
│   │   └── cache.service.ts
│   ├── routes/                # Express routers
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── job.routes.ts
│   │   ├── application.routes.ts
│   │   ├── aiCoach.routes.ts
│   │   ├── insights.routes.ts
│   │   └── notification.routes.ts
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── validate.ts        # Zod body validation
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── upload.ts          # Multer (PDF/DOCX, 5MB max)
│   ├── utils/
│   │   ├── textAnalysis.ts    # TF-IDF, Cosine, Jaccard
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── helpers.ts
│   ├── validators/            # Zod schemas
│   └── index.ts               # App entry point
├── ml/                        # Python ML microservice
│   ├── app.py                 # Flask server
│   ├── recommendation.py
│   ├── nlp_processor.py
│   └── skill_analyzer.py
├── tests/
│   └── unit/
│       ├── textAnalysis.test.ts
│       └── recommendation.service.test.ts
└── uploads/                   # Resume file storage
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Python 3.11+ (for ML service)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)
```

### 3. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all 15 tables)
npx prisma migrate dev --name init
```

> **Note:** If upgrading from an earlier version, run:
> ```bash
> npx prisma migrate dev --name add_password_reset_fields
> ```

### 4. Start the development server

```bash
npm run dev
```

Server starts at `http://localhost:5000`

### 5. (Optional) Start the ML service

```bash
cd ml
pip install -r requirements.txt
python app.py
```

ML service runs at `http://localhost:5001`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobsearch

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth — Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth — GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI
OPENAI_API_KEY=sk-...

# Job APIs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JSEARCH_API_KEY=your_rapidapi_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@jobsearch.ai
```

> **Free APIs** (no key needed): Remotive, The Muse, Arbeitnow

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Email/password login |
| POST | `/refresh` | ❌ | Refresh access token |
| POST | `/logout` | ✅ | Logout (invalidate token) |
| GET | `/me` | ✅ | Get current user |
| POST | `/forgot-password` | ❌ | Request password reset email |
| POST | `/reset-password` | ❌ | Reset password with token |
| GET | `/google` | ❌ | Google OAuth |
| GET | `/github` | ❌ | GitHub OAuth |

### 👤 Profile — `/api/profile`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get full profile |
| PUT | `/` | Update basic info + preferences |
| GET | `/completion` | Profile completion percentage |
| POST | `/skills` | Add skill |
| DELETE | `/skills/:id` | Remove skill |
| POST | `/experience` | Add work experience |
| PUT | `/experience/:id` | Update experience |
| DELETE | `/experience/:id` | Delete experience |
| POST | `/education` | Add education |
| POST | `/resume` | Upload resume (PDF/DOCX, 5MB max) |

### 🔍 Jobs — `/api/jobs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search` | Search across 5 APIs with filters |
| GET | `/recommendations` | Personalised AI recommendations |
| GET | `/:id/similar` | Similar jobs |
| GET | `/:id/match` | Match score breakdown for a job |

**Search query params:** `q`, `location`, `jobType`, `experienceLevel`, `salaryMin`, `salaryMax`, `remote`, `datePosted`, `sortBy`, `page`, `limit`

### 📁 Applications — `/api/applications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/saved` | Save a job |
| GET | `/saved` | Get saved jobs |
| DELETE | `/saved/:id` | Unsave a job |
| POST | `/apply` | Mark job as applied |
| GET | `/` | Get all applications |
| PATCH | `/:id/status` | Update application status |
| GET | `/stats` | Application funnel stats |
| POST | `/alerts` | Create job alert |
| GET | `/alerts` | List job alerts |
| DELETE | `/alerts/:id` | Delete job alert |

### 🧠 AI Coach — `/api/ai-coach`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Chat with AI career coach |
| POST | `/resume-review` | Score + review resume text |
| POST | `/cover-letter` | Generate personalised cover letter |
| POST | `/interview-prep` | Get role-specific interview Q&A |
| POST | `/salary-negotiation` | Salary benchmark + negotiation tips |
| POST | `/career-path` | Career roadmap from current → target role |
| GET | `/sessions` | List chat sessions |
| GET | `/sessions/:id` | Get session history |
| DELETE | `/sessions/:id` | Delete session |

### 📊 Insights — `/api/insights`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary?role=&location=` | Salary benchmarks |
| GET | `/skills` | Skill demand in the market |
| GET | `/trends` | Job market trends |
| GET | `/skill-gap?role=` | Personalised skill gap analysis |
| GET | `/companies?limit=20` | Top hiring companies + mass hiring flags |

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?unreadOnly=true` | List notifications |
| PATCH | `/read-all` | Mark all as read |
| PATCH | `/:id/read` | Mark one as read |
| DELETE | `/:id` | Delete notification |

---

## 🗃 Database Schema

**15 Prisma models:**

```
User ──► Profile ──► UserSkill ──► Skill
                 ├──► WorkExperience
                 ├──► Education
                 └──► Certification

User ──► SavedJob
     ──► JobApplication
     ──► ChatHistory
     ──► UserActivity
     ──► JobAlert
     └──► Notification

JobsCache            (aggregated job data)
Company              (company insights)
MarketInsightsCache  (analytics cache)
```

---

## 🤖 ML Service

The Python ML service (`/ml`) provides enhanced NLP capabilities:

- **`/recommend`** — Advanced collaborative filtering
- **`/nlp/extract-skills`** — NLP-based skill extraction from text
- **`/analyze/skill-gap`** — Deep skill gap analysis

The TypeScript backend falls back gracefully if the ML service is unavailable.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Current:** 11/11 tests passing across 2 test suites:
- `textAnalysis.test.ts` — TF-IDF, Cosine similarity, Jaccard edge cases
- `recommendation.service.test.ts` — Skill matching, experience levels, alias resolution

---

## 🚢 Deployment

### Environment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ random chars)
- [ ] Configure production PostgreSQL (Supabase / AWS RDS)
- [ ] Configure Redis (Upstash / Railway)
- [ ] Set `FRONTEND_URL` to your deployed frontend domain
- [ ] Run database migrations: `npx prisma migrate deploy`

### One-time Migration (New Fields)

```bash
npx prisma migrate deploy
```

### Docker

```bash
docker build -t jobsearch-backend .
docker run -p 5000:5000 --env-file .env jobsearch-backend
```

### Health Check

```
GET /health
→ { status: "ok", timestamp: "...", uptime: 123 }
```

---

## 📄 License

MIT
