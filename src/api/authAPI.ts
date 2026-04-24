import request from '@/utils/request'
import type { LoginRequest, LoginResponse } from '@/types/authType'

/**
 * POST /auth/login
 * 登录接口
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  return request.post('/auth/login', data)
}
