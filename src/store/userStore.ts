import { login } from '@/api/authAPI'
import { getUserInfo } from '@/api/userAPI'
import type { LoginRequest } from '@/types/authType'
import type { UserInfo } from '@/types/userType'
import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
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
      const data = await login(request)

      const token = data.token
      this.token = token
      setToken(token, rememberLogin)

      await this.fetchUserInfoAction()
    },
    /**
     * 退出登录
     * 清除token和用户信息
     * 从本地存储中移除token
     */
    logoutAction() {
      this.token = ''
      this.userInfo = null
      removeToken()
    },
    async fetchUserInfoAction() {
      const data = await getUserInfo()
      this.userInfo = data
    },
  },
})
