import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type UserInfo } from '@/types/userType'
import { getUserInfo } from '@/api/userAPI'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = computed(() => token.value !== null)

  /**
   * 设置token
   */
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    const res = await getUserInfo()
    if (res.code === 0 && res.data) {
      userInfo.value = res.data
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
    userInfo,
    isLogin,
    setToken,
    fetchUserInfo,
    logout,
  }
})
