# CLAUDE.md — PrepWise AI

Before doing anything, read these files first:
- `docs/PROJECT.md` — what this product is
- `docs/ARCHITECTURE.md` — full technical architecture, API routes, data flow

---

## Project Summary

PrepWise AI is an AI-powered interview platform. Users upload a resume, get it scored, then do a live voice interview with an AI that asks personalized questions based on their resume.

---

## Monorepo Structure

```
PrepWiseAI/
├── CLAUDE.md               ← you are here
├── docs/
│   ├── PROJECT.md          ← product overview
│   └── ARCHITECTURE.md     ← technical architecture
├── frontend/               ← Next.js 15 app
├── backend/                ← Express 5 / Node.js app
└── docker-compose.yml      ← not created yet
```

---

## Frontend

**Stack:** Next.js 15, TypeScript, Tailwind CSS, App Router

**Node version:** 22.x

```
frontend/
└── src/
    ├── app/                ← App Router pages
    │   ├── (auth)/         ← login, signup (Google OAuth redirect)
    │   ├── (main)/
    │   │   ├── dashboard/      ← resume upload + score cards
    │   │   └── interview/[id]/ ← live interview room + result
    │   ├── layout.tsx
    │   └── page.tsx        ← home / landing page
    ├── components/         ← reusable UI components
    ├── services/
    │   └── api/            ← typed API calls to Express backend
    ├── store/              ← Redux slices
    └── types/              ← shared TypeScript types
```

**Import alias:** `@/*` maps to `src/*`

**Routing flow:**
```
/ (home)  →  /dashboard  →  /interview/[id]  →  /interview/[id]/result
```

**Auth:** Google OAuth 2.0 — frontend redirects to `GET /api/v1/auth/google`, backend sets httpOnly JWT cookie on callback.

---

## Backend

**Stack:** Node.js, Express 5, TypeScript, Passport.js, Mongoose, LangChain, Gemini API, Chroma, MongoDB

**Package manager:** pnpm

```
backend/
└── src/
    ├── app.ts              ← Express app (middleware, routes wired)
    ├── server.ts           ← HTTP server entry point
    ├── passport.ts         ← Google OAuth strategy
    ├── config/
    │   ├── env.ts          ← typed env vars
    │   └── database.ts     ← Mongoose connect
    ├── routes/
    │   └── index.ts        ← all routes
    ├── controllers/
    │   └── auth.controller.ts
    ├── services/
    │   └── auth.service.ts
    ├── middlewares/
    │   └── auth.middleware.ts   ← JWTUserCookie guard
    ├── models/
    │   └── user.model.ts
    ├── swagger/
    │   └── index.ts        ← Swagger spec (served at /api-docs)
    └── utils/
        ├── helpers/        ← errorHandler, statusError, controller, middleware helpers
        ├── schemas/        ← validation schemas
        ├── types/          ← TypeScript types
        └── constants/      ← shared constants
```

**API base:** `/api/v1`

---

## Coding Rules

- **TypeScript strict mode** — no `any` types (both frontend and backend)
- **Components** — one component per file, named exports
- **API calls** — always go through `src/services/api/`, never fetch directly in components
- **Styling** — Tailwind only, no inline styles, no CSS modules
- **Dark theme** — default theme is dark (matching the score card UI)
- **No comments** unless the logic is genuinely non-obvious
- **No `console.log`** left in committed code
- **Backend errors** — always use `StatusError` helpers, never raw `res.status()`

---

## Environment Variables

Backend (`backend/.env`):
```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/prepwise
CLIENT_URL=http://localhost:3000
SECRET_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback
BACKEND_URL=http://localhost:8000
GEMINI_API_KEY=
CHROMA_HOST=chroma
CHROMA_PORT=8001
```

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Current Status

- [x] Project structure planned
- [x] docs/ created (PROJECT.md, ARCHITECTURE.md)
- [x] frontend/ scaffolded (Next.js 15) — landing page done
- [x] backend/ scaffolded (Express 5, TypeScript, pnpm)
- [x] Google OAuth + JWT auth (backend) — routes: /auth/google, /auth/me, /auth/logout
- [ ] Auth flow wired to frontend
- [ ] Dashboard page + resume upload
- [ ] Resume scoring (Gemini)
- [ ] Interview room (WebSocket + WebRTC)
- [ ] Docker Compose
