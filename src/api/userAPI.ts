import request from '@/api/request'
import type { CommonResponse } from '@/types/apiType'
import type { UserInfo } from '@/types/userType'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<CommonResponse<UserInfo>> {
  return request.get('/user/info')
}
