import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

import rootRoutes from '@/routes'
import swaggerDocument from '@/swagger'
import envs from '@/config/env'
import initializePassport from '@/passport'
import errorHandler from '@/utils/helpers/errorHandler'
import { jwtAuth } from '@/middlewares/auth.middleware'
import StatusError from '@/utils/helpers/statusError'

const app = express()

app.set('trust proxy', 1)

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { withCredentials: true },
}))

// Security headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        frameguard: { action: 'deny' },
        contentSecurityPolicy: {
            directives: {
                defaultSrc:     ["'self'"],
                frameAncestors: ["'none'"],
            },
        },
    })
)
app.disable('x-powered-by')

// Cache control
app.use('/api/v1', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.removeHeader('Server')
    next()
})

// Rate limiting
app.use(
    rateLimit({
        windowMs:        15 * 60 * 1000,
        max:             1000,
        standardHeaders: true,
        legacyHeaders:   false,
        handler:         (req, res) => {
            res.status(429).json({
                status: false,
                error:  'Too many requests, please try again later.',
            })
        },
    })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))

// CORS
app.use(
    cors({
        origin:         [envs.client_url],
        methods:        ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge:         86400,
        credentials:    true,
    })
)

// Passport
initializePassport(passport)
app.use(passport.initialize())

// Serve public folder (protected — JWT required)
app.use('/public', jwtAuth, express.static(path.resolve('./public')))

// Routes
app.use('/api/v1', rootRoutes)

// 404
app.use((req, res, next) => next(StatusError.notFound('Not found')))

// Error handler
app.use(errorHandler.handleError)

export default app
