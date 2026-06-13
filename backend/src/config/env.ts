import dotenv from 'dotenv'
dotenv.config()

const envs = {
    port:                 Number(process.env.PORT) || 8000,
    node_env:             process.env.NODE_ENV || 'development',
    mongodb_uri:          process.env.MONGODB_URI || 'mongodb://mongodb:27017/prepwise',
    client_url:           process.env.CLIENT_URL || 'http://localhost:3000',
    secret_key:           process.env.SECRET_KEY || 'changeme',
    google_client_id:     process.env.GOOGLE_CLIENT_ID || '',
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    google_callback_url:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/v1/auth/google/callback',
    backend_url:          process.env.BACKEND_URL || 'http://localhost:8000',
    gemini_api_key:       process.env.GEMINI_API_KEY || '',
    groq_api_key:         process.env.GROQ_API_KEY || '',

    get is_production() {
        return this.node_env === 'production'
    },
}

export default envs
