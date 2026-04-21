import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import router from '@/router'
import { toast } from '@/utils/toast'

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
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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
  (response: AxiosResponse) => {
    const res = response.data
    // 业务成功
    if (res.code === 0) {
      return res.data
    }

    // 业务失败
    toast.error(res.message || '操作失败')
    return Promise.reject(res)
  },
  (error) => {
    const status = error.response?.status
    switch (status) {
      case 401:
        toast.warn('登录已过期，请重新登录')

        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        router.push('/login')
        break

      case 403:
        toast.error('没有权限访问')
        break

      case 404:
        toast.error('请求资源不存在')
        break

      case 500:
        toast.error('服务器错误')
        break

      default:
        toast.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  },
)

export default request
