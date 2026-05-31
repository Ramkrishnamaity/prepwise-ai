import { Request, Response, NextFunction } from 'express'

type ControllerHandler = (req: Request, res: Response) => Promise<any>

const controller = (handler: ControllerHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res)
        } catch (err) {
            next(err)
        }
    }
}

export { controller }
