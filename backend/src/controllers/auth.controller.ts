import { Request, Response } from 'express'
import { controller } from '@/utils/helpers/controller'
import helpers from '@/utils/helpers/helpers'
import authService from '@/services/auth.service'
import { COOKIE_NAME, COOKIE_MAX_AGE } from '@/utils/constants/common.constants'
import StatusError from '@/utils/helpers/statusError'
import envs from '@/config/env'

const googleCallback = controller(async (req: Request, res: Response) => {
    const user = req.user
    if (!user) throw StatusError.unauthorized('Google authentication failed')

    const token = helpers.buildToken(user)

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure:   envs.is_production,
        sameSite: 'lax',
        maxAge:   COOKIE_MAX_AGE,
    })

    res.redirect(`${envs.client_url}/dashboard`)
})

const getMe = controller(async (req: Request, res: Response) => {
    const payload = req.user as any
    const user = await authService.getUserById(payload.sub)
    if (!user) throw StatusError.notFound('User not found')
    res.json({ status: true, data: user })
})

const logout = controller(async (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME)
    res.json({ status: true, message: 'Logged out successfully' })
})

const authController = { googleCallback, getMe, logout }

export default authController
