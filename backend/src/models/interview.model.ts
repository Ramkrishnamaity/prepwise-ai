import mongoose, { Schema } from 'mongoose'
import { IInterview } from '@/utils/types/model.types'

export type { IInterview }

const InterviewScoresSchema = new Schema(
    {
        overAll:       { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        technical:     { type: Number, default: 0 },
    },
    { _id: false }
)

const InterviewSchema = new Schema<IInterview>(
    {
        userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
        resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
        scores:   { type: InterviewScoresSchema, default: () => ({}) },
        strengths:    { type: [String], default: [] },
        improvements: { type: [String], default: [] },
        feedback:     { type: String, default: '' },
        status: {
            type: Number,
            enum: [
                0, // Pending     — session created, interview not yet started
                1, // In Progress — interview is currently active
                2, // Completed   — interview finished normally
                3, // Absconded   — user left mid-interview
            ],
            default: 0,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

export default mongoose.model<IInterview>('Interview', InterviewSchema)
