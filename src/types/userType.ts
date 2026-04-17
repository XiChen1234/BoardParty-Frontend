/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatarUrl: string
  gender: Gender
  registerTime: string
}

/**
 * 性别
 */
export enum Gender {
  DEFAULT = 'DEFAULT',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
