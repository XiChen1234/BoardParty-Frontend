/**
 * API 响应体通用接口
 * @template T - 响应体数据类型
 */
export interface ApiResponse<T> {
  code: number
  message: string | null
  data: T
}

/**
 * 后端 validation 错误项
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * 后端 validation 错误响应
 */
export interface ValidationErrorResponse {
  code: number
  message: string
  errors: ValidationError[]
}
