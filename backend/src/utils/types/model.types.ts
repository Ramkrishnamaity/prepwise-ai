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

