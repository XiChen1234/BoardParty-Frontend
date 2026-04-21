import type { CommonResponse } from '@/types/apiType'
import request from './request'
import type { LoginRequest, LoginResponse } from '@/types/authType'

/**
 * POST /auth/login
 * 登录接口
 */
export function login(data: LoginRequest): Promise<CommonResponse<LoginResponse>> {
  return request.post('/auth/login', data)
}
