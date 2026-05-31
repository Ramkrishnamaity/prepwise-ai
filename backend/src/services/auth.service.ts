import { Profile } from 'passport-google-oauth20'
import User, { IUser } from '@/models/user.model'

const saveOrUpdateUser = async (profile: Profile): Promise<IUser> => {
    const google_id = profile.id
    const email     = profile.emails?.[0]?.value || ''
    const name      = profile.displayName
        || [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ')
        || ''
    const picture   = profile.photos?.[0]?.value || ''

    const user = await User.findOneAndUpdate(
        { google_id },
        { google_id, email, name, picture },
        { upsert: true, new: true }
    )

    return user!
}

const getUserById = async (id: string): Promise<IUser | null> => {
    return User.findById(id)
}

const authService = { saveOrUpdateUser, getUserById }

export default authService
