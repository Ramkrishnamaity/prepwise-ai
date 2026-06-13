import { groqClient } from '@/config/llm'
import { resumeAnalysisPrompt } from '@/utils/helpers/prompts'

interface ResumeAnalysis {
    valid:        boolean
    ats_score:    number
    strengths:    string[]
    improvements: string[]
}

const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
    const response = await groqClient.chat.completions.create({
        model:           'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'user', content: resumeAnalysisPrompt(text) },
        ],
    })

    const json = JSON.parse(response.choices[0].message.content ?? '{}') as ResumeAnalysis

    return {
        valid:        Boolean(json.valid),
        ats_score:    Math.min(100, Math.max(0, Number(json.ats_score) || 0)),
        strengths:    Array.isArray(json.strengths)    ? json.strengths    : [],
        improvements: Array.isArray(json.improvements) ? json.improvements : [],
    }
}

const groqService = { analyzeResume }
export default groqService
