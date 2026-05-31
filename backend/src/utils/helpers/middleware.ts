import { Request, Response, NextFunction } from 'express'

type MiddlewareHandler = (req: Request, res: Response) => Promise<any>

const middleware = (handler: MiddlewareHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res)
            next()
        } catch (err) {
            next(err)
        }
    }
}

export { middleware }
