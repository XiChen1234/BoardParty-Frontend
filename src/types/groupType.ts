/**
 * 用户在小圈中的角色
 */
export enum UserRole {
  CREATOR = 0, // 创建者
  ADMIN = 1, // 管理员
  MEMBER = 2, // 成员
}

/**
 * 筛选类型
 */
export enum GroupFilterType {
  ALL = 'all',
  JOINED = 'joined',
  CREATED = 'created',
}

/**
 * 视图模式
 */
export enum GroupViewMode {
  GRID = 'grid',
  LIST = 'list',
}

/**
 * 小圈列表项
 */
export interface GroupListItem {
  id: number
  name: string
  avatarUrl: string
  description: string
  memberCount: number
  userRole: UserRole
  joinTime?: string
}

/**
 * 成员信息
 */
export interface GroupMember {
  id: number
  nickname: string
  avatarUrl: string
  gender: number
  role: number
}

/**
 * 小圈详情
 */
export interface GroupDetail {
  id: number
  name: string
  avatarUrl: string
  description: string
  memberCount: number
  memberList: GroupMember[]
  userRole: number
  joinTime: string
}

/**
 * 创建小圈请求
 */
export interface GroupCreateRequest {
  name: string
  avatarUrl?: string
  description?: string
}

/**
 * API 响应格式
 */
export interface ApiResponse<T> {
  code: number
  message: string | null
  data: T
}
