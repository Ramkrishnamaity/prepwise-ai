import axiosInstance from './index'
import type { ResumeAnalysis } from '@/types/resume'

interface UploadResumeResponse {
    status: boolean
    data: {
        _id:           string
        userId:        string
        filename:      string
        extractedText: string
        valid:         boolean
        ats_score:     number
        strengths:     string[]
        improvements:  string[]
        created_at:    string
        updated_at:    string
    }
}

const uploadResume = async (file: File): Promise<ResumeAnalysis> => {
    const formData = new FormData()
    formData.append('resume', file)
    const { data } = await axiosInstance.post<UploadResumeResponse>('/resume/upload', formData)
    const { valid, ats_score, strengths, improvements } = data.data
    return { valid, ats_score, strengths, improvements }
}

const resumeApi = { uploadResume }

export default resumeApi
