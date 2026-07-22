# Interview Feature — Implementation Plan

> Step 1 (Resume Upload & Scoring) is done.
> This document covers Steps 2–4: Start Interview → Live Session → End & Evaluate.

---

## 1. High-Level Flow

```
User clicks "Start Interview" on Dashboard
        │
        ▼
POST /api/v1/interview/start   ← HTTP (REST)
  - fetch extractedText from MongoDB
  - chunk + embed → Chroma (collection: resumeId)
  - create Interview doc (status: In Progress)
  - return { interviewId }
        │
        ▼
Browser opens WebSocket: /ws/interview/:interviewId
        │
        ▼
Backend sends first AI question (via RAG + Gemini)
        │
  ┌─────┴──────────────────────────────────┐
  │         LIVE INTERVIEW LOOP            │
  │                                        │
  │  AI question → WebSocket → Browser     │
  │  User speaks → Web Speech API (STT)    │
  │  Transcript → WebSocket → Backend      │
  │  RAG search + history → Gemini         │
  │  Next question → WebSocket → Browser   │
  └─────┬──────────────────────────────────┘
        │  (User clicks "End" or N turns reached)
        ▼
Backend evaluates full conversation → Gemini
  - saves scores, feedback to MongoDB
  - deletes Chroma collection
  - sends result over WebSocket
        │
        ▼
Frontend navigates to /interview/:id/result
```

---

## 2. System Components Overview

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| REST API | Express 5 | Start interview, fetch result |
| WebSocket | `ws` library | Real-time question/answer exchange |
| RAG Service | Chroma + Gemini Embeddings | Resume context retrieval |
| Interview Engine | Gemini Flash | Question generation, evaluation |
| Frontend WS Client | Native WebSocket API | Connect, send answers, receive questions |
| Voice Input | Web Speech API + getUserMedia | Mic access + STT in browser |

---

## 3. Backend Architecture

### 3.1 New Files

```
backend/src/
├── ws/
│   └── interview.ws.ts        ← WebSocket handler + session map
├── services/
│   ├── rag.service.ts         ← Chroma + Gemini embeddings
│   └── interview.service.ts   ← Question generation + evaluation
├── controllers/
│   └── interview.controller.ts ← HTTP handlers for /interview routes
```

### 3.2 Modified Files

```
backend/src/
├── server.ts                  ← http.createServer + WS upgrade
├── routes/index.ts            ← add interview routes
├── models/interview.model.ts  ← add messages[] array
├── utils/helpers/prompts.ts   ← add interview prompts
├── config/env.ts              ← ensure chroma_host/port exported
```

---

## 4. Frontend Architecture

### 4.1 New Files

```
frontend/src/
├── services/
│   ├── socket/
│   │   └── interview.socket.ts   ← WS client class
│   ├── webrtc/
│   │   └── audio.service.ts      ← getUserMedia + SpeechRecognition
│   └── api/
│       └── interview.api.ts      ← POST /interview/start, GET /interview/:id/result
├── hooks/
│   └── useVoiceInput.ts          ← voice input React hook
├── store/slices/
│   └── interviewSlice.ts         ← interview Redux state
├── types/
│   └── interview.ts              ← WS message types, InterviewResult
├── components/interview/         ← interview UI components (TBD)
```

### 4.2 Modified Files

```
frontend/src/
├── app/(main)/interview/[id]/page.tsx          ← build out interview room
├── app/(main)/interview/[id]/result/page.tsx   ← build out result page
├── components/dashboard/ScorePanel.tsx         ← wire "Start Interview" button
```

---

## 5. Data Models

### 5.1 Interview Model Update

Add `messages` array to existing Interview schema:

```typescript
// New field added to interview.model.ts
messages: [
  {
    role: 'ai' | 'user'   // who sent it
    content: string        // question text or answer transcript
    timestamp: Date
  }
]
```

All other existing fields remain unchanged:
`userId, resumeId, scores, strengths, improvements, feedback, status`

---

## 6. API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/v1/interview/start` | JWT cookie | Create session, init RAG, return interviewId |
| `GET` | `/api/v1/interview/:id/result` | JWT cookie | Fetch completed interview result |
| `WS` | `/ws/interview/:id` | JWT (query param or cookie) | Real-time interview channel |

### POST /interview/start — Request/Response

```typescript
// Request body
{ resumeId: string }

// Response 201
{ interviewId: string }
```

---

## 7. WebSocket Message Protocol

```typescript
// Client → Server
{ type: "start" }                         // open session, trigger first question
{ type: "answer", text: string }          // user's answer (STT transcript)
{ type: "end" }                           // user manually ends session

// Server → Client
{ type: "question", text: string }        // AI's next question
{ type: "result", data: InterviewResult } // final evaluation (after end)
{ type: "error", message: string }        // error (auth fail, session not found, etc.)
```

---

## 8. RAG Service Design

```
createCollection(resumeId, text):
  1. Split text: chunk_size=500, overlap=50
  2. Embed each chunk: Gemini text-embedding-004
  3. Upsert to Chroma: collection = resumeId

similaritySearch(resumeId, query, k=3):
  1. Embed query
  2. Cosine similarity search in collection
  3. Return top-k chunk strings

deleteCollection(resumeId):
  1. Drop Chroma collection
```

---

## 9. Interview Engine Design

```
generateFirstQuestion(resumeId):
  1. similaritySearch(resumeId, "candidate background skills experience")
  2. Prompt Gemini: "You are an interviewer. Based on this resume context, ask an opening question."
  3. Return question string

generateNextQuestion(resumeId, messages[]):
  1. lastAnswer = messages[last user message].content
  2. similaritySearch(resumeId, lastAnswer)
  3. Build prompt: top-k chunks + last 6 messages + follow-up instruction
  4. Return next question OR null if ≥10 total exchanges (triggers auto-end)

evaluateInterview(messages[]):
  1. Build full transcript string
  2. Prompt Gemini: evaluate and return JSON
  3. Parse: { scores: {overAll, communication, technical}, strengths[], improvements[], feedback }
```

---

## 10. Frontend Interview Page States

```
idle       → connect WebSocket → send "start"
connecting → waiting for first question
active     → question displayed, mic button enabled
  listening  → user holding mic button, STT running
  sending    → transcript sent, waiting for next question
ended      → result received → navigate to /result
```

---

## 11. Voice Input (WebRTC + Web Speech API)

No server-side WebRTC media server needed. Approach:
- `navigator.mediaDevices.getUserMedia({ audio: true })` — request mic permission
- `new SpeechRecognition()` (or `webkitSpeechRecognition`) — browser-native STT
- Hold-to-talk UI: `startListening()` → animate → release → `stopAndGetTranscript()`
- Transcript text sent as `{ type: "answer", text }` over WebSocket

> Audio never leaves the browser. Only the text transcript is sent to the backend.

---

## 12. Packages to Install

**Backend:**
```bash
pnpm add ws chromadb @langchain/textsplitters
pnpm add -D @types/ws
```

**Frontend:**
```
None — WebSocket, getUserMedia, SpeechRecognition are all native browser APIs
```

---

## 13. Build Order (Phase by Phase)

| # | Phase | What Gets Built |
|---|-------|-----------------|
| 1 | Model update | Add `messages[]` to Interview model |
| 2 | WebSocket server | `http.createServer` + WS upgrade + JWT auth on WS |
| 3 | Interview HTTP routes | `POST /interview/start`, `GET /interview/:id/result` |
| 4 | RAG service | Chroma client + Gemini embeddings + similarity search |
| 5 | Interview engine | First question, follow-up, evaluation via Gemini |
| 6 | Wire WS to engine | Connect phases 2+4+5: full backend interview loop |
| 7 | Frontend WS service | `interview.socket.ts` client class |
| 8 | Interview page (text) | Chat UI, WebSocket connected, text input first |
| 9 | Voice input | Mic + STT hook, replace text input |
| 10 | Result page | Fetch + display scores, feedback |

---

## 14. Verification Checklist

- [ ] `POST /interview/start` returns `interviewId`, Chroma collection created
- [ ] WS connect with valid JWT succeeds; invalid JWT returns error + close
- [ ] Send `{ type: "start" }` → receive first question within 3s
- [ ] Send `{ type: "answer", text: "..." }` → receive next question
- [ ] After 10 exchanges OR send `{ type: "end" }` → receive result
- [ ] Interview document in MongoDB has all messages saved
- [ ] Chroma collection deleted after interview ends
- [ ] Frontend: mic button → speak → transcript appears → question arrives
- [ ] Frontend: result page shows scores, feedback
- [ ] Absconded case: close browser mid-interview → status set to 3 in MongoDB
