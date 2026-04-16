export interface CommonResponse<T> {
  code: number
  msg: string | null
  data: T
}
