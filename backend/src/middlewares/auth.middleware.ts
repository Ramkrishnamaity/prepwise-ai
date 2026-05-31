import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { middleware } from '@/utils/helpers/middleware'
import { COOKIE_NAME } from '@/utils/constants/common.constants'
import { JWTPayload } from '@/utils/types/auth.types'
import StatusError from '@/utils/helpers/statusError'
import envs from '@/config/env'

const JWTUserCookie = middleware(async (req: Request, res: Response) => {
    const token = req.cookies[COOKIE_NAME]

    if (!token) {
        throw StatusError.unauthorized('Not authenticated')
    }

    const payload = jwt.verify(token, envs.secret_key) as JWTPayload
    req.user = payload as any
})

const authMiddlewares = { JWTUserCookie }

export default authMiddlewares
