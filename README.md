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
