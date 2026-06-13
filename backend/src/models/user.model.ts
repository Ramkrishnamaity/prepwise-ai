import mongoose, { Schema } from 'mongoose'
import { IUser } from '@/utils/types/model.types'

export type { IUser }

const UserSchema = new Schema<IUser>(
    {
        google_id: { type: String, required: true, unique: true },
        email:     { type: String, required: true, unique: true },
        name:      { type: String, required: true },
        picture:   { type: String },
        is_active: { type: Boolean, default: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

export default mongoose.model<IUser>('User', UserSchema)
