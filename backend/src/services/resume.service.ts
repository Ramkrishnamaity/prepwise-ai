import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import mongoose from 'mongoose'
import Resume from '@/models/resume.model'
import { IResume } from '@/utils/types/model.types'

interface SaveAnalysisInput {
    userId:        string
    filename:      string
    extractedText: string
    valid:         boolean
    ats_score:     number
    strengths:     string[]
    improvements:  string[]
}

const extractText = async (buffer: Buffer, mimetype: string): Promise<string> => {
    if (mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: buffer })
        const result = await parser.getText()
        await parser.destroy()
        return result.text.trim()
    }

    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
}

const saveAnalysis = async (input: SaveAnalysisInput): Promise<IResume> => {
    return Resume.create(input)
}

const getAnalysesByUser = async (userId: string) => {
    return Resume.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $sort:  { created_at: -1 } },
    ])
}

const getPastAnalyses = async (userId: string) => {
    return Resume.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $sort:  { created_at: -1 } },
        { $project: {
            valid:        1,
            ats_score:    1,
            strengths:    1,
            improvements: 1,
            created_at:   1,
        }},
        { $lookup: {
            from:         'interviews',
            localField:   '_id',
            foreignField: 'resumeId',
            pipeline: [
                { $project: {
                    scores:       1,
                    strengths:    1,
                    improvements: 1,
                    feedback:     1,
                    status:       1,
                    created_at:   1,
                }},
            ],
            as: 'interviews',
        }},
    ])
}

const resumeService = { extractText, saveAnalysis, getAnalysesByUser, getPastAnalyses }

export default resumeService
