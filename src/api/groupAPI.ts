import request from '@/api/request'
import type { CommonResponse } from '@/types/apiType'
import type { GroupListItem, GroupCreateRequest, GroupDetail } from '@/types/groupType'

/**
 * POST /group/create
 * 创建新的小圈
 * @param data 小圈创建信息
 * @returns 小圈ID
 */
export function createGroup(data: GroupCreateRequest): Promise<CommonResponse<number>> {
  return request.post('/group/create', data)
}

/**
 * GET /groups/me
 * 获取用户加入的小圈列表
 * @returns 用户加入的小圈列表
 */
export function getUserGroups(): Promise<CommonResponse<GroupListItem[]>> {
  return request.get('/groups/me')
}

/**
 * GET /groups/{id}
 * 获取小圈详情
 * @param id 小圈ID
 * @returns 小圈详情
 */
export function getGroupDetail(id: number): Promise<CommonResponse<GroupDetail>> {
  return request.get(`/groups/${id}`)
}
