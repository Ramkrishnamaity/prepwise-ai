import { Request, Response, NextFunction } from 'express'
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

    helpers.logError(err, req)

    return res.status(500).json({
        status: false,
        error: 'Server error. Please try again later.',
    })
}

const errorHandler = { handleError }

export default errorHandler
