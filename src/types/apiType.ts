export interface CommonResponse<T> {
  code: number
  message: string | null
  data: T | null
}

export interface CommonError {
  code: number
  message: string | null
}
