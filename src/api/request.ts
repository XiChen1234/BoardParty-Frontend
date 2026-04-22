import axios, { type AxiosInstance } from 'axios'
import router from '@/router'
import { toast } from '@/utils/toast'
import { getToken } from '@/utils/storage'

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
  const token = getToken()
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
  (response) => {
    return response.data // CommonResponse
  },
  (error) => {
    const status = error.response?.status

    switch (status) {
      case 401:
        toast.warn('登录已过期')
        router.push('/login')
        break
      case 403:
        toast.error('没有权限')
        break
      case 404:
        toast.error('资源不存在')
        break
      case 500:
        toast.error('服务器错误')
        break
      default:
        toast.error('网络错误')
    }

    return Promise.reject(error)
  },
)

export default request
