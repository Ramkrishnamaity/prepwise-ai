import { PassportStatic } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import envs from '@/config/env'
import authService from '@/services/auth.service'
import { COOKIE_NAME } from '@/utils/constants/common.constants'
import { JWTPayload } from '@/utils/types/auth.types'

const initializePassport = (passportInstance: PassportStatic) => {
    passportInstance.use(
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

    passportInstance.use(
        'jwt',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req) => req?.cookies?.[COOKIE_NAME] ?? null,
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                ]),
                secretOrKey: envs.secret_key,
            },
            (payload: JWTPayload, done) => done(null, payload)
        )
    )
}

export default initializePassport
