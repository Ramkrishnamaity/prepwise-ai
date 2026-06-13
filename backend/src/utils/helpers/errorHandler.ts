import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { isCelebrateError } from 'celebrate'
import StatusError from '@/utils/helpers/statusError'
import helpers from '@/utils/helpers/helpers'

const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    if (err instanceof StatusError) {
        return res.status(err.statusCode).json({
            status: false,
            error:  err.message,
            ...err.data,
        })
    }

    if (isCelebrateError(err)) {
        const messages: string[] = []
        for (const [, joiError] of err.details.entries()) {
            messages.push(...joiError.details.map((d: any) => d.message.split('"').join('')))
        }
        return res.status(400).json({ status: false, error: messages.join(', ') })
    }

    if (err instanceof multer.MulterError || err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
            status: false,
            error:  err.message,
        })
    }

    helpers.logError(err, req)

    return res.status(500).json({
        status: false,
        error: 'Server error. Please try again later.',
    })
}

const errorHandler = { handleError }

export default errorHandler
