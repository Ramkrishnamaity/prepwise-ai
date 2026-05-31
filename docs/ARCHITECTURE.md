# Architecture — PrepWise AI

---

## System Overview

```
User Browser
    │
    ├─ HTTP/REST ──────────────► Express Backend (Node.js)
    │                                │
    └─ WebSocket ──────────────►     │
         │                      ┌───┴────────────┐
         │ (WebRTC signaling)   │                │
         │                   MongoDB           Chroma
         └── WebRTC ─────►  (sessions,       (resume
          (audio/video)      users, scores)    vectors)
                                  │
                             Gemini API
                           (LLM + Embeddings)
```

---

## Services

| Service | Technology | Port |
|---|---|---|
| Frontend | Next.js 15 | 3000 |
| Backend | Node.js + Express 5 | 8000 |
| Database | MongoDB | 27017 |
| Vector Store | Chroma | 8001 |

All services run via a single `docker compose up`.

---

## Backend Structure

```
backend/
├── src/
│   ├── app.ts                 Express app setup (middleware, routes)
│   ├── server.ts              Entry point — starts HTTP server
│   ├── passport.ts            Passport Google OAuth strategy
│   │
│   ├── config/
│   │   ├── env.ts             Typed env vars (dotenv)
│   │   └── database.ts        Mongoose connection
│   │
│   ├── routes/
│   │   └── index.ts           All routes mounted here
│   │
│   ├── controllers/
│   │   └── auth.controller.ts googleCallback, getMe, logout
│   │
│   ├── services/
│   │   └── auth.service.ts    Google OAuth user upsert logic
│   │   (resume.service.ts)    PDF/DOCX → plain text  [TODO]
│   │   (rag.service.ts)       text → Chroma vectors  [TODO]
│   │   (scoring.service.ts)   Gemini resume scoring  [TODO]
│   │   (interview.service.ts) LangChain interview    [TODO]
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts JWTUserCookie guard
│   │
│   ├── models/
│   │   └── user.model.ts      Mongoose User schema
│   │   (resume.model.ts)      Resume + scores        [TODO]
│   │   (interview.model.ts)   Session + messages     [TODO]
│   │
│   ├── swagger/
│   │   └── index.ts           Swagger/OpenAPI spec
│   │
│   └── utils/
│       ├── helpers/           controller, middleware, errorHandler, statusError, helpers
│       ├── schemas/           Zod/validation schemas
│       ├── types/             TypeScript types
│       └── constants/         Shared constants
│
├── package.json               pnpm project
└── tsconfig.json
```

---

## API Routes

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/auth/google` | Initiate Google OAuth | — |
| GET | `/api/v1/auth/google/callback` | OAuth callback → sets JWT cookie | — |
| GET | `/api/v1/auth/me` | Get current user | JWT cookie |
| POST | `/api/v1/auth/logout` | Clear auth cookie | — |
| POST | `/api/v1/resume/upload` | Upload PDF/DOCX | JWT cookie [TODO] |
| GET | `/api/v1/resume/:id/score` | Get resume scores | JWT cookie [TODO] |
| POST | `/api/v1/interview/start` | Start interview session | JWT cookie [TODO] |
| GET | `/api/v1/interview/:id/history` | Get session messages | JWT cookie [TODO] |
| WS | `/ws/interview/:session_id` | Real-time interview channel | JWT [TODO] |

Swagger UI available at `GET /api-docs`.

---

## Auth Flow

```
Browser                        Express Backend              MongoDB
   │                                  │                        │
   │── GET /api/v1/auth/google ───────►│                        │
   │◄─ 302 → Google OAuth ────────────│                        │
   │                                  │                        │
   │── Google callback ───────────────►│                        │
   │                       Passport verifies token              │
   │                       Upsert user ─────────────────────────►│
   │                       Sign JWT                             │
   │◄─ Set-Cookie: token=<jwt> ────────│                        │
   │                                  │                        │
   │── GET /api/v1/auth/me ───────────►│                        │
   │        (cookie sent automatically)│                        │
   │◄─ { user } ───────────────────────│                        │
```

JWT is stored in an **httpOnly cookie** (`token`). No localStorage.

---

## Data Flow

### 1. Resume Upload & Scoring

```
User uploads PDF/DOCX
        │
        ▼
resume.service    →  extracts raw text
        │
        ▼
rag.service       →  chunks text  →  Gemini Embeddings  →  Chroma
        │
        ▼
scoring.service   →  Gemini analyzes resume  →  returns JSON scores
        │
        ▼
MongoDB stores resume + scores
        │
        ▼
Frontend shows score dashboard (ATS, Skills, Projects, etc.)
```

### 2. Interview Session

```
User clicks "Start Interview"
        │
        ▼
POST /api/v1/interview/start  →  creates session in MongoDB
        │
        ▼
Browser opens WebSocket  →  /ws/interview/{session_id}
        │
        ▼
WebRTC signaling over WebSocket  →  audio/video peer connection established
        │
        ▼
interview.service:
  LangChain retrieves resume context from Chroma
  Gemini generates first question
  WebSocket sends question to browser
  TTS converts question to audio
        │
        ▼
Candidate speaks answer
  STT transcribes audio → text
  WebSocket sends transcript to backend
        │
        ▼
interview.service:
  LangChain adds answer to conversation memory
  Gemini generates follow-up question (context-aware)
  Loop continues until session ends
        │
        ▼
Session saved to MongoDB  →  available in Interview History
```

---

## Real-Time Layer

```
Browser                          Express WebSocket
   │                                    │
   │── connect /ws/interview/abc ──────►│
   │                                    │
   │── { type: "offer", sdp: "..." } ──►│  (WebRTC signaling)
   │◄─ { type: "answer", sdp: "..." } ──│
   │── { type: "ice", candidate: ... } ►│
   │                                    │
   │════════ WebRTC audio/video ════════│  (P2P, no server relay)
   │                                    │
   │◄─ { type: "question", text: "..." }│  (AI question)
   │── { type: "answer", text: "..." } ►│  (STT transcript)
```

---

## Resume Scoring Model

Gemini is prompted to return structured JSON:

```json
{
  "ats_compatibility": 68,
  "work_experience": 70,
  "skills_section": 82,
  "projects": 80,
  "education": 85,
  "impact_quantification": 45
}
```

Each score is out of 100. The frontend renders these as score cards with color-coded progress bars.

---

## RAG Pipeline

```
Resume Text
    │
    ▼
RecursiveCharacterTextSplitter (chunk_size=500, overlap=50)
    │
    ▼
Gemini Embedding API  →  vector per chunk
    │
    ▼
Chroma (persisted local store, one collection per resume)
    │
    ▼
At interview time: similarity search → top-k chunks → Gemini prompt context
```

---

## Frontend Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/signup` `/login` | Auth (redirects to Google OAuth) |
| `/dashboard` | Resume score cards + upload |
| `/interview/[id]` | Live interview room (video + chat) |
| `/interview/[id]/result` | Post-interview feedback |
| `/history` | Past interview sessions |

---

## Environment Variables

Backend (`backend/.env`):
```env
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
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=http://localhost:8000
```
