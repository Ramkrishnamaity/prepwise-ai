import axiosInstance from './index'

const authApi = {
    getMe: () => axiosInstance.get('/auth/me'),
    logout: () => axiosInstance.post('/auth/logout'),
}

export default authApi
