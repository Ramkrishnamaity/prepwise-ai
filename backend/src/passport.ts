import { PassportStatic } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import envs from '@/config/env'
import authService from '@/services/auth.service'

const initializePassport = (passport: PassportStatic) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID:     envs.google_client_id,
                clientSecret: envs.google_client_secret,
                callbackURL:  envs.google_callback_url,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await authService.saveOrUpdateUser(profile)
                    return done(null, user as any)
                } catch (err) {
                    return done(err as Error)
                }
            }
        )
    )
}

export default initializePassport
