import { Router } from 'express'
import passport from 'passport'
import authController from '@/controllers/auth.controller'
import authMiddlewares from '@/middlewares/auth.middleware'
import uploadMiddleware from '@/middlewares/upload.middleware'
import resumeController from '@/controllers/resume.controller'

const router = Router()

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false, prompt: 'select_account' })
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

router.post(
    '/resume/upload',
    uploadMiddleware.single('resume'),
    authMiddlewares.JWTUserCookie,
    resumeController.upload
)

export default router
