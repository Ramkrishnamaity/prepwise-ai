import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import StatusError from '@/utils/helpers/statusError'
import { JWTPayload } from '@/utils/types/auth.types'

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: JWTPayload | false) => {
        if (err || !user) return next(StatusError.unauthorized('Not authenticated'))
        req.user = user as any
        next()
    })(req, res, next)
}
