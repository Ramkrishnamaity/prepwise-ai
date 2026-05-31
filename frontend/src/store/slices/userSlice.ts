import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id:       string
    email:    string
    name:     string
    picture?: string
}

interface UserState {
    user:            User | null
    isLoggedIn:      boolean
    authInitialized: boolean
}

const initialState: UserState = {
    user:            null,
    isLoggedIn:      false,
    authInitialized: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user           = action.payload
            state.isLoggedIn     = true
            state.authInitialized = true
        },
        clearUser: (state) => {
            state.user           = null
            state.isLoggedIn     = false
            state.authInitialized = true
        },
    },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
