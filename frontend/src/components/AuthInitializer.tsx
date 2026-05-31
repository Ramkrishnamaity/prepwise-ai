'use client'

import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setUser, clearUser } from '@/store/slices/userSlice'
import authApi from '@/services/api/auth.api'

export default function AuthInitializer() {
    const dispatch       = useDispatch()
    const { authInitialized } = useSelector((state: RootState) => state.user)
    const called         = useRef(false)

    useEffect(() => {
        if (authInitialized || called.current) return
        called.current = true

        authApi.getMe()
            .then(({ data }) => dispatch(setUser(data.data)))
            .catch(() => dispatch(clearUser()))
    }, [])

    return null
}
