import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
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

const getAnalysesByUser = async (userId: string): Promise<IResume[]> => {
    return Resume.find({ userId }).sort({ created_at: -1 })
}

const resumeService = { extractText, saveAnalysis, getAnalysesByUser }

export default resumeService
