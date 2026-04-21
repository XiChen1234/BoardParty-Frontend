import { login } from '@/api/authAPI'
import { getUserInfo } from '@/api/userAPI'
import type { CommonResponse } from '@/types/apiType'
import type { LoginRequest, LoginResponse } from '@/types/authType'
import type { UserInfo } from '@/types/userType'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
  }),
  actions: {
    /**
     * 登录
     * 调用登录接口获取token和用户信息
     * @param request 登录请求参数，包含用户名和密码
     * @param rememberLogin 是否记住登录状态，记住后会将token存储在localStorage，否则存储在sessionStorage
     */
    async loginAction(request: LoginRequest, rememberLogin: boolean) {
      const res: CommonResponse<LoginResponse> = await login(request)
      if (res.code !== 0 || !res.data) {
        throw new Error(res.msg || '登录失败')
      }
      const token = res.data.token
      this.token = token

      // 清除旧的token，避免重复登录
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')

      if (rememberLogin) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }

      await this.fetchUserInfoAction()
      console.log(this.userInfo)
    },
    /**
     * 退出登录
     * 清除token和用户信息
     * 从本地存储中移除token
     */
    logoutAction() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },
    async fetchUserInfoAction() {
      try {
        const res: CommonResponse<UserInfo> = await getUserInfo()
        if (res.code !== 0 || !res.data) {
          throw new Error(res.msg || '获取用户信息失败')
        }
        this.userInfo = res.data
      } finally {
      }
    },
  },
})
