import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import router from '@/router'

/**
 * 请求实例
 */
const request: AxiosInstance = axios.create({
  baseURL: '/board-party/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 * 添加token到请求头
 */
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * 响应拦截器
 * 解包响应数据，处理错误状态
 */
request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default request
