# PrepWise AI

An AI-powered interview preparation platform that conducts personalized mock interviews based on your resume.

---

## What It Does

Upload your resume. PrepWise AI reads it, scores it, and then interviews you — asking questions directly based on your skills, projects, and experience. The AI adapts its follow-up questions based on how you answer.

---

## Core Features

- **Resume Upload** — PDF or DOCX support
- **Resume Scoring** — ATS compatibility, Skills, Work Experience, Projects, Education, Impact scores
- **AI Interview** — Personalized questions generated from your actual resume content
- **Voice Interview** — Talk to the AI interviewer, it listens and responds
- **Adaptive Follow-ups** — AI digs deeper based on your answers
- **Interview History** — Review past sessions and track improvement

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, TypeScript |
| Backend | Node.js, Express 5, TypeScript |
| Auth | Passport.js, Google OAuth 2.0, JWT |
| AI | Gemini API, LangChain, RAG |
| Vector DB | Chroma |
| Database | MongoDB, Mongoose |
| Real-Time | WebRTC, WebSocket |
| DevOps | Docker Compose |

---

## Quick Start

```bash
git clone https://github.com/your-username/PrepWiseAI
cd PrepWiseAI
cp .env.example .env        # add your Gemini API key
docker compose up --build
```

App runs at `http://localhost:3000`
