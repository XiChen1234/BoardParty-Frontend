export interface ToastItem {
  id: number
  type: 'success' | 'info' | 'warn' | 'error'
  message: string
  duration: number
}
export interface ToastOptions {
  type?: 'success' | 'info' | 'warn' | 'error'
  message: string
  duration?: number
}
