import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type UserInfo, Gender } from '@/types/userType'
import { getUserInfo } from '@/api/userAPI'
import { login as loginApi } from '@/api/authAPI'
import axios from 'axios'

/**
 * 后端用户信息格式（原始响应）
 */
interface BackendUserInfo {
  id: number
  username: string
  nickname: string
  avatarUrl: string
  gender: string
  registerTime: string
}

/**
 * 将后端用户信息转换为前端格式
 */
function transformUserInfo(data: BackendUserInfo): UserInfo {
  const genderMap: Record<string, Gender> = {
    MALE: Gender.male,
    FEMALE: Gender.female,
  }

  return {
    id: data.id,
    username: data.username,
    nickname: data.nickname,
    avatar_url: data.avatarUrl,
    gender: genderMap[data.gender] ?? Gender.default,
    register_time: data.registerTime,
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const rememberLogin = ref<boolean>(localStorage.getItem('rememberLogin') === 'true')
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = computed(() => token.value !== null)

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录是否成功
   */
  async function login(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await loginApi({ username, password })
      if (res.code === 0 && res.data) {
        setToken(res.data.token)
        return { success: true }
      } else {
        return { success: false, message: res.msg || '登录失败' }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.msg || error.message || '网络错误'
        return { success: false, message }
      }
      return { success: false, message: '网络错误' }
    }
  }

  /**
   * 设置token
   */
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /**
   * 设置记住登录状态
   */
  function setRememberLogin(value: boolean) {
    rememberLogin.value = value
    localStorage.setItem('rememberLogin', String(value))
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    const res = await getUserInfo()
    if (res.code === 0 && res.data) {
      userInfo.value = transformUserInfo(res.data as unknown as BackendUserInfo)
    } else {
      throw new Error(res.msg || '获取用户信息失败')
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    token.value = null
    localStorage.removeItem('token')
    userInfo.value = null
  }

  return {
    token,
    rememberLogin,
    userInfo,
    isLogin,
    login,
    setToken,
    setRememberLogin,
    fetchUserInfo,
    logout,
  }
})
