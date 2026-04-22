/**
 * 获取token，优先从localStorage获取，失败则从sessionStorage获取
 * @returns token字符串
 */
export function getToken(): string {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || ''
}

/**
 * 设置token
 * @param token token值
 * @param remember 是否永久保存，true存localStorage，false存sessionStorage
 */
export function setToken(token: string, remember: boolean): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  if (remember) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token', token)
  }
}

/**
 * 清除token
 */
export function removeToken(): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}
