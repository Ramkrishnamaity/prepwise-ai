import { Router } from 'express'
import passport from 'passport'
import authController from '@/controllers/auth.controller'
import { jwtAuth } from '@/middlewares/auth.middleware'
import uploadMiddleware from '@/middlewares/upload.middleware'
import resumeController from '@/controllers/resume.controller'
import seedInterviews from '../../seed/interviews'

const router = Router()

router.get('/dev/seed/interviews', async (req, res) => {
    await seedInterviews()
    res.json({ status: true, message: 'Interviews seeded' })
})

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
    jwtAuth,
    authController.getMe
)

router.post(
    '/auth/logout',
    authController.logout
)

router.get(
    '/resume/past-analyses',
    jwtAuth,
    resumeController.getPastAnalyses
)

router.post(
    '/resume/upload',
    uploadMiddleware.single('resume'),
    jwtAuth,
    resumeController.upload
)

export default router
