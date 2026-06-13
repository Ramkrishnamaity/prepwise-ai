import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import envs from '@/config/env'

export const geminiClient = new GoogleGenerativeAI(envs.gemini_api_key)
export const groqClient   = new Groq({ apiKey: envs.groq_api_key })
