import mongoose from 'mongoose'
import envs from '@/config/env'

export const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(envs.mongodb_uri)
        console.log('✅ Database connected successfully.')
    } catch (err) {
        console.error('❌ Database connection error:', err)
        process.exit(1)
    }
}

