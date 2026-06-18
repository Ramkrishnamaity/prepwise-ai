import { Request, Response } from 'express'
import { controller } from '@/utils/helpers/controller'
import StatusError from '@/utils/helpers/statusError'
import resumeService from '@/services/resume.service'
// import geminiService from '@/services/gemini.service'
import groqService from '@/services/groq.service'
import { JWTPayload } from '@/utils/types/auth.types'
import { cleanResumeText } from '@/utils/helpers/helpers'

type MulterRequest = Request & {
    file?: {
        fieldname: string
        originalname: string
        mimetype: string
        buffer: Buffer
        size: number
    }
}

const upload = controller(async (req: Request, res: Response) => {
    const { file } = req as MulterRequest
    if (!file) throw StatusError.badRequest('No file uploaded')

    const userId = (req.user as unknown as JWTPayload).sub
    const filename = file.originalname

    const rawText = await resumeService.extractText(file.buffer, file.mimetype)
    const extractedText = cleanResumeText(rawText)

    if (!extractedText) throw StatusError.badRequest('File appears to be empty or unreadable')

    // const scoring = await geminiService.analyzeResume(extractedText)
    const scoring = await groqService.analyzeResume(extractedText)
    const analysis = await resumeService.saveAnalysis({
        userId,
        filename,
        extractedText,
        ...scoring,
    })

    res.status(201).json({
        status: true,
        data: {
            _id:          analysis._id,
            valid:        analysis.valid,
            ats_score:    analysis.ats_score,
            strengths:    analysis.strengths,
            improvements: analysis.improvements,
        },
    })
})

const getPastAnalyses = controller(async (req: Request, res: Response) => {
    const userId = (req.user as unknown as JWTPayload).sub
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
    const limit = Math.max(1, parseInt(req.query.limit as string) || 5)
    const { data, total } = await resumeService.getPastAnalyses(userId, page, limit)
    res.status(200).json({
        status: true,
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
})

const deleteResume = controller(async (req: Request, res: Response) => {
    const userId  = (req.user as unknown as JWTPayload).sub
    const id      = req.params.id as string
    const deleted = await resumeService.deleteResume(id, userId)
    if (!deleted) throw StatusError.notFound('Resume not found')
    res.status(200).json({ status: true })
})

const resumeController = { upload, getPastAnalyses, deleteResume }

export default resumeController
