import mongoose, { Schema } from 'mongoose'
import { IResume } from '@/utils/types/model.types'

export type { IResume }

const ResumeSchema = new Schema<IResume>(
    {
        userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
        filename:      { type: String, required: true },
        extractedText: { type: String, required: true },
        valid:         { type: Boolean, default: false },
        ats_score:     { type: Number, default: 0 },
        strengths:     { type: [String], default: [] },
        improvements:  { type: [String], default: [] },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

export default mongoose.model<IResume>('Resume', ResumeSchema)
