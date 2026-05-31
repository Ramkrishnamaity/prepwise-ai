import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    google_id:  string
    email:      string
    name:       string
    picture?:   string
    is_active:  boolean
    created_at: Date
    updated_at: Date
}

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
