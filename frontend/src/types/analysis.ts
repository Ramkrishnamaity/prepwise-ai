export interface InterviewScores {
    overAll:       number
    communication: number
    technical:     number
}

export interface InterviewRecord {
    _id:          string
    scores:       InterviewScores
    strengths:    string[]
    improvements: string[]
    feedback:     string
    status:       0 | 1 | 2 | 3
    created_at:   string
}

export interface PastAnalysis {
    _id:          string
    valid:        boolean
    ats_score:    number
    strengths:    string[]
    improvements: string[]
    created_at:   string
    interviews:   InterviewRecord[]
}

export interface PaginationMeta {
    total:      number
    page:       number
    limit:      number
    totalPages: number
}

export interface PaginatedAnalysisResponse {
    data:       PastAnalysis[]
    pagination: PaginationMeta
}
