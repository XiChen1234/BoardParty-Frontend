import request from '../utils/request'
import type { Punishment } from '@/types/punishmentType'

/**
 * 获取随机的公共惩罚
 * * @returns 随机的公共惩罚
 */
export function getPublicPunishment(): Promise<Punishment> {
  return request.get('/punishments/public/random')
}

/**
 * 获取所在小组的随机惩罚
 * * @param groupId 组ID
 * * @returns 所在小组的随机惩罚
 */
export function getGroupPunishment(groupId: number): Promise<Punishment> {
  return request.get(`/punishments/group/${groupId}/random`)
}
