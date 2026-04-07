/**
 * 桌游接口
 */
export interface Game {
  id: number
  groupId: number
  name: string
  icon: string
  description: string
  minPlayer: number
  maxPlayer: number
  duration: number
  images: string[]
  star: number
  enabled: number
  tags: Tag[]
}

/**
 * 标签接口
 */
export interface Tag {
  id: number
  name: string
}

/**
 * 筛选条件接口
 */
export interface Condition {
  type: 'playerCount' | 'playerRange' | 'duration' | 'tag'
  label: string
  value: string | number
}
