import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
    google_id:  string
    email:      string
    name:       string
    picture?:   string
    is_active:  boolean
    created_at: Date
    updated_at: Date
}

export interface IResume extends Document {
    userId:        mongoose.Types.ObjectId
    filename:      string
    extractedText: string
    valid:         boolean
    ats_score:     number
    strengths:     string[]
    improvements:  string[]
    created_at:    Date
    updated_at:    Date
}

export interface IInterviewScores {
    overAll:       number
    communication: number
    technical:     number
}

export interface IInterview extends Document {
    userId:       mongoose.Types.ObjectId
    resumeId:     mongoose.Types.ObjectId
    scores:       IInterviewScores
    strengths:    string[]
    improvements: string[]
    feedback:     string
    status:       0 | 1 | 2 | 3
    created_at:   Date
    updated_at:   Date
}

