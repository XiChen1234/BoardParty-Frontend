/**
 * 小圈列表项
 */
export interface GroupListItem {
  id: number
  name: string
  avatarUrl: string
  description: string
}

/**
 * 创建小圈请求
 */
export interface GroupCreateRequest {
  name: string
  avatarUrl?: string
  description?: string
}
