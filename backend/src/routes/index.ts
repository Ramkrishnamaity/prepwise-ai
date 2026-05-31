import { Router } from 'express'
import passport from 'passport'
import authController from '@/controllers/auth.controller'
import authMiddlewares from '@/middlewares/auth.middleware'

const router = Router()

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    authController.googleCallback

)

router.get(
    '/auth/me',
    authMiddlewares.JWTUserCookie,
    authController.getMe

)

router.post(
    '/auth/logout',
    authController.logout
)

export default router
