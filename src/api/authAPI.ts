import request from './request'
import type { CommonResponse } from '@/types/apiType'
import type { LoginRequest, LoginResponse } from '@/types/authType'

/**
 * POST /auth/login
 * 登录接口
 */
export function login(data: LoginRequest) {
  return request.post<CommonResponse<LoginResponse>>('/auth/login', data)
}
