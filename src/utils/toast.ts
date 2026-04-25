import { createApp } from 'vue'
import ToastMessage from '@/components/Toast/ToastMessage.vue'
import type { ToastOptions } from '@/types/toastType'

type ToastInstance = {
  addToast: (options: ToastOptions) => void
}

let instance: ToastInstance | null = null

function initToast() {
  if (instance) return

  const div = document.createElement('div')
  document.body.appendChild(div)

  const app = createApp(ToastMessage)

  const vm = app.mount(div) as unknown as ToastInstance

  instance = vm
}

function show(options: ToastOptions) {
  initToast()
  instance!.addToast(options)
}

export const toast = {
  success(message: string, duration?: number) {
    show({ type: 'success', message, duration })
  },

  info(message: string, duration?: number) {
    show({ type: 'info', message, duration })
  },

  warn(message: string, duration?: number) {
    show({ type: 'warn', message, duration })
  },

  error(message: string, duration?: number) {
    show({ type: 'error', message, duration })
  },
}
