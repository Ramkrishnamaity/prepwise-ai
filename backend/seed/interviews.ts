import mongoose from 'mongoose'
import Interview from '@/models/interview.model'

const USER_ID = '6a2d6ffa4819281033bd6b62'

const RESUME_IDS = {
    R1:  '6a2ff36e8dde8f1a8d94a1de',
    R2:  '6a30047ac69c22958b0b03f3',
    R3:  '6a326c74810a19aa0653dee1',
    R4:  '6a326c85810a19aa0653dee2',
    R5:  '6a326c8f810a19aa0653dee3',
    R6:  '6a326c9b810a19aa0653dee4',
    R7:  '6a326ca1810a19aa0653dee5',
    R8:  '6a326ca8810a19aa0653dee6',
    R9:  '6a326cba810a19aa0653dee7',
    R10: '6a326cc2810a19aa0653dee8',
    R11: '6a326cdd810a19aa0653dee9',
    R12: '6a326ce4810a19aa0653deea',
}

const uid  = (id: string) => new mongoose.Types.ObjectId(id)
const user = uid(USER_ID)

const seedInterviews = async () => {
    await Interview.insertMany([

        // ── R1: 2 interviews — Completed (high) + Absconded ──────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R1),
            scores:   { overAll: 85, communication: 80, technical: 90 },
            strengths: [
                'Strong understanding of data structures and algorithms',
                'Clearly explained past project architecture',
                'Confident and articulate communication',
            ],
            improvements: [
                'System design answers lacked scalability consideration',
                'Could improve on edge case handling',
            ],
            feedback: 'A strong overall performance. Solid technical depth especially in algorithms. System design needs more practice at scale but fundamentals are there.',
            status: 2,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R1),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 3,
        },

        // ── R2: 3 interviews — Completed (avg) + In Progress + Pending ───────
        {
            userId: user, resumeId: uid(RESUME_IDS.R2),
            scores:   { overAll: 62, communication: 72, technical: 55 },
            strengths: [
                'Good communication and presentation',
                'Showed enthusiasm and willingness to learn',
            ],
            improvements: [
                'Weak on core JavaScript concepts like closures and event loop',
                'Could not explain REST vs GraphQL trade-offs clearly',
                'Needs more hands-on practice with async patterns',
            ],
            feedback: 'Communication was a clear strength but technical answers were shallow. Core JavaScript fundamentals need significant work.',
            status: 2,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R2),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 1,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R2),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 0,
        },

        // ── R3: 1 interview — Completed (excellent) ───────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R3),
            scores:   { overAll: 92, communication: 95, technical: 89 },
            strengths: [
                'Exceptional communication — answers were clear and structured',
                'Demonstrated deep knowledge of React internals and hooks',
                'Handled behavioral questions with strong STAR format',
                'Excellent problem decomposition under pressure',
            ],
            improvements: [
                'Minor gaps in database indexing knowledge',
            ],
            feedback: 'One of the strongest performances seen. Near-perfect communication and impressive React depth. Minor gap in DB optimization but negligible overall.',
            status: 2,
        },

        // ── R4: 1 interview — Completed (poor) ───────────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R4),
            scores:   { overAll: 38, communication: 45, technical: 32 },
            strengths: [
                'Showed up on time and was polite throughout',
            ],
            improvements: [
                'Could not explain basic OOP concepts',
                'Struggled with even simple array manipulation problems',
                'No understanding of async/await or promises',
                'Unable to articulate any past project clearly',
                'Needs significant preparation before next attempt',
            ],
            feedback: 'Very early stage of preparation. Technical fundamentals are missing and communication needs significant work. Recommend revisiting basics from scratch.',
            status: 2,
        },

        // ── R5: 2 interviews — Completed (good) + Completed (better retry) ───
        {
            userId: user, resumeId: uid(RESUME_IDS.R5),
            scores:   { overAll: 70, communication: 65, technical: 74 },
            strengths: [
                'Good grasp of Node.js event loop',
                'Reasonable approach to REST API design',
            ],
            improvements: [
                'Communication was hesitant at times',
                'Struggled with SQL query optimization',
            ],
            feedback: 'Decent technical showing with room to grow. Communication needs more confidence. SQL knowledge was the weakest area.',
            status: 2,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R5),
            scores:   { overAll: 78, communication: 80, technical: 76 },
            strengths: [
                'Noticeably more confident than previous attempt',
                'Strong improvement in communication clarity',
                'Better SQL answers this time',
            ],
            improvements: [
                'System design still needs work',
                'Could elaborate more on trade-offs',
            ],
            feedback: 'Clear improvement over the last session. Communication jumped significantly. System design is the next area to focus on.',
            status: 2,
        },

        // ── R6: Pending only (no interview taken yet) ─────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R6),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 0,
        },

        // ── R7: In Progress ───────────────────────────────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R7),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 1,
        },

        // ── R8: Absconded ─────────────────────────────────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R8),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 3,
        },

        // ── R9: 3 interviews — mixed progression ──────────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R9),
            scores:   { overAll: 55, communication: 60, technical: 50 },
            strengths: [
                'Familiar with basic HTTP methods',
                'Good attitude and eagerness to improve',
            ],
            improvements: [
                'Confused React class vs functional components',
                'Could not write a basic Promise chain',
                'Needs more project work to back up skills',
            ],
            feedback: 'Effort is visible but core skills need more time. Recommend hands-on project building over the next few weeks.',
            status: 2,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R9),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 3,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R9),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 0,
        },

        // ── R10: 1 interview — Completed (above average) ──────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R10),
            scores:   { overAll: 81, communication: 78, technical: 84 },
            strengths: [
                'Strong TypeScript knowledge',
                'Well-structured answers with clear examples',
                'Good understanding of CI/CD pipelines',
            ],
            improvements: [
                'Could improve knowledge of caching strategies',
                'Microservices design was high-level, lacking depth',
            ],
            feedback: 'Solid overall interview. TypeScript and CI/CD stood out. Caching and distributed systems design are areas to sharpen before senior-level roles.',
            status: 2,
        },

        // ── R11: 2 interviews — Completed (mid) + Pending ────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R11),
            scores:   { overAll: 67, communication: 74, technical: 61 },
            strengths: [
                'Clear verbal communication',
                'Knew Git workflows well',
            ],
            improvements: [
                'Weak on Big-O analysis',
                'Could not implement a binary search correctly',
                'Docker knowledge was surface-level only',
            ],
            feedback: 'Communication was a highlight but technical depth did not match resume claims. Algorithm fundamentals and Docker need dedicated practice.',
            status: 2,
        },
        {
            userId: user, resumeId: uid(RESUME_IDS.R11),
            scores: { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 0,
        },

        // ── R12: 1 interview — Completed (very high) ─────────────────────────
        {
            userId: user, resumeId: uid(RESUME_IDS.R12),
            scores:   { overAll: 96, communication: 98, technical: 94 },
            strengths: [
                'Outstanding communication — best in recent sessions',
                'Flawless system design for a distributed task queue',
                'Deep knowledge of MongoDB aggregation pipelines',
                'Handled edge cases proactively without prompting',
                'Strong understanding of CAP theorem and trade-offs',
            ],
            improvements: [
                'Could explore more front-end performance optimization techniques',
            ],
            feedback: 'Exceptional interview across the board. Communication, system design, and depth of knowledge all at senior level. Ready for a staff engineer interview loop.',
            status: 2,
        },

    ])
}

export default seedInterviews
