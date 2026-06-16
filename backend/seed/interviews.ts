import mongoose from 'mongoose'
import Interview from '@/models/interview.model'

const USER_ID    = '6a2d6ffa4819281033bd6b62'
const RESUME_ID1 = '6a2ff36e8dde8f1a8d94a1de'
const RESUME_ID2 = '6a30047ac69c22958b0b03f3'

const seedInterviews = async () => {
    await Interview.insertMany([
        {
            userId:   new mongoose.Types.ObjectId(USER_ID),
            resumeId: new mongoose.Types.ObjectId(RESUME_ID1),
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
            userId:   new mongoose.Types.ObjectId(USER_ID),
            resumeId: new mongoose.Types.ObjectId(RESUME_ID1),
            scores:   { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 3,
        },
        {
            userId:   new mongoose.Types.ObjectId(USER_ID),
            resumeId: new mongoose.Types.ObjectId(RESUME_ID2),
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
            userId:   new mongoose.Types.ObjectId(USER_ID),
            resumeId: new mongoose.Types.ObjectId(RESUME_ID2),
            scores:   { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 1,
        },
        {
            userId:   new mongoose.Types.ObjectId(USER_ID),
            resumeId: new mongoose.Types.ObjectId(RESUME_ID2),
            scores:   { overAll: 0, communication: 0, technical: 0 },
            strengths: [], improvements: [], feedback: '',
            status: 0,
        },
    ])
}

export default seedInterviews
