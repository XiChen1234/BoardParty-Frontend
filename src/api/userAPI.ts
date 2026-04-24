import request from '@/utils/request'
import type { UserInfo } from '@/types/userType'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return request.get('/user/me')
}
