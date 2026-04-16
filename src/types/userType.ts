/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar_url: string
  gender: Gender
  register_time: string
}

/**
 * 性别
 */
export enum Gender {
  default = 0,
  male = 1,
  female = 2,
}
