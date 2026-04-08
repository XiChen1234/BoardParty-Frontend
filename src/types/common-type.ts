/**
 * API 响应体通用接口
 * @template T - 响应体数据类型
 */
export interface ApiResponse<T> {
  code: string
  message: string | null
  data: T
}
