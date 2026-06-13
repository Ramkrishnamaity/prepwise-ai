import { geminiClient } from '@/config/llm'
import { resumeAnalysisPrompt } from '@/utils/helpers/prompts'

interface ResumeAnalysis {
    valid:        boolean
    ats_score:    number
    strengths:    string[]
    improvements: string[]
}

const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
    const model  = geminiClient.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: 'application/json' },
    })

    const result = await model.generateContent(resumeAnalysisPrompt(text))
    const json   = JSON.parse(result.response.text()) as ResumeAnalysis

    return {
        valid:        Boolean(json.valid),
        ats_score:    Math.min(100, Math.max(0, Number(json.ats_score) || 0)),
        strengths:    Array.isArray(json.strengths)    ? json.strengths    : [],
        improvements: Array.isArray(json.improvements) ? json.improvements : [],
    }
}

const geminiService = { analyzeResume }
export default geminiService
