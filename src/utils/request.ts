import axios, { type AxiosInstance } from 'axios'
import { getToken } from '@/utils/storage'
import { ResponseCode } from '@/types/responseCode'
import { useUserStore } from '@/store/userStore'

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
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器
 * 解包响应数据，处理错误状态
 * 0. 处理成功响应
 * 1. 成功响应，业务错误处理
 * 2. Http层错误处理
 */
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === ResponseCode.SUCCESS.code) {
      return res.data // CommonResponse<T>
    }

    // 系统错误统一处理
    if (
      res.code === ResponseCode.AUTH_NOT_LOGIN.code ||
      res.code === ResponseCode.AUTH_TOKEN_EXPIRED.code ||
      res.code === ResponseCode.AUTH_FAILED.code
    ) {
      useUserStore().logoutAction()
    }

    return Promise.reject({
      code: res.code,
      message: res.message || '未知错误',
    })
  },
  (error) => {
    const status = error.response?.status
    let message = '网络错误'

    switch (status) {
      case 401:
        message = '登录已过期'
        useUserStore().logoutAction()
        break
      case 403:
        message = '没有权限'
        break
      case 404:
        message = '资源不存在'
        break
      case 500:
        message = '服务器错误'
        break
    }
    return Promise.reject({
      code: status || -1,
      message,
    })
  },
)

export default request
