import axiosInstance from './index'
import type { ResumeAnalysis } from '@/types/resume'
import type { PastAnalysis, PaginatedAnalysisResponse } from '@/types/analysis'

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

const getPastAnalyses = async (page = 1, limit = 5): Promise<PaginatedAnalysisResponse> => {
    const { data } = await axiosInstance.get<{ status: boolean } & PaginatedAnalysisResponse>(
        `/resume/past-analyses?page=${page}&limit=${limit}`
    )
    return { data: data.data, pagination: data.pagination }
}

const resumeApi = { uploadResume, getPastAnalyses }

export default resumeApi
