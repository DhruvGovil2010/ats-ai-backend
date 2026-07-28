# HireFlow API

An AI-powered Applicant Tracking System (ATS) backend built with Node.js and Express. Handles job postings and applications with async resume parsing, semantic candidate-job match scoring, Redis caching, and queue-based background processing.

Built as a backend-focused portfolio project to demonstrate production-style architecture: layered code structure, async processing, caching strategy, containerization, and CI.

---

## Features

- JWT authentication with refresh token rotation, role-based access (Recruiter / Candidate)
- Job posting CRUD with filterable, paginated search (MongoDB compound indexing)
- Application submission with duplicate-prevention and status tracking
- AI-powered resume parsing (structured data extraction from uploaded resumes)
- Semantic match scoring between resumes and job descriptions via embeddings
- AI-generated candidate summaries for recruiters
- Async background processing via BullMQ + Redis (non-blocking resume parsing)
- Redis-based caching (cache-aside pattern) on job search endpoints
- Rate limiting on AI-triggered endpoints
- Dockerized (multi-container: app, worker, MongoDB, Redis)
- CI pipeline via GitHub Actions (lint + test on push)

*(Check off / update this list as features actually land)*

---

## Tech Stack

**Core:** Node.js, Express.js, MongoDB (Mongoose)
**Caching / Queue:** Redis, BullMQ
**AI:** Groq / Gemini API (resume parsing, embeddings)
**Auth:** JWT (access + refresh token rotation)
**Testing:** Jest, Supertest
**DevOps:** Docker, Docker Compose, GitHub Actions
**Language:** JavaScript (Node.js), TypeScript (AI/matching service module)

---

## Architecture

*(update later — add diagram image here once created, e.g. `docs/architecture-diagram.png`)*

**High-level flow (resume parsing):**
```
Candidate uploads resume
  → API saves file + creates application record (status: pending)
  → Job pushed to BullMQ queue
  → API responds immediately (non-blocking)
  → Worker process picks up job
  → Worker calls AI API for parsing + embedding
  → Application record updated (status: parsed, match score attached)
```

The app and worker run as separate processes (separate Docker containers) sharing the same codebase and MongoDB/Redis instances — this decouples slow AI calls from the request/response cycle.

---

## Project Structure

```
src/
├── config/       → DB, Redis, env setup
├── models/       → Mongoose schemas
├── routes/       → Route definitions
├── controllers/  → Request handlers
├── services/     → Business logic (incl. AI service)
├── middleware/    → Auth, role checks, error handling
├── utils/        → Helpers
├── validators/   → Request validation
├── queues/       → BullMQ queue definitions      (added Week 3)
├── workers/      → Background job processors     (added Week 3)
├── app.js
└── server.js
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas free tier or local)
- Redis (local or Upstash free tier)
- Docker (optional, for containerized run)

### Local Setup
```bash
git clone https://github.com/DhruvGovil2010/ats-ai-backend.git
cd ats-ai-backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

### Environment Variables
See `.env.example` for the full list. Required:
- `PORT`
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `REDIS_URL`
- *(AI API key vars — added Week 4)*

### Running with Docker
*(update later — Week 6)*
```bash
docker-compose up --build
```

---

## API Documentation

*(update later — Postman collection link or Swagger docs, added progressively)*

---

## Testing
```bash
npm test
```
*(update later — Week 6, once test suite exists)*

---

## Roadmap / Build Log

- [x] Project setup, folder structure, health check endpoint
- [ ] Auth (signup, login, refresh, logout)
- [ ] Job CRUD + search/filter + pagination
- [ ] Application flow + duplicate prevention
- [ ] Redis caching on job search
- [ ] BullMQ async queue + worker
- [ ] AI resume parsing
- [ ] AI match scoring + candidate summaries
- [ ] Dockerization
- [ ] CI/CD pipeline
- [ ] Deployment

---

## Author

**Dhruv Govil**
[LinkedIn](https://linkedin.com/in/govildhruv) 
[GitHub](https://github.com/DhruvGovil2010) 
[LeetCode](https://leetcode.com/u/DhruvGovil2010)
