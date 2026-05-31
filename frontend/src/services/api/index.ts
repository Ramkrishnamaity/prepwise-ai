import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:         process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error?.response)
)

export default axiosInstance
