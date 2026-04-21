<script setup lang="ts">
import type { ToastItem, ToastOptions } from '@/types/toastType'
import { ref } from 'vue'

const toastList = ref<ToastItem[]>([])
const MAX_TOAST = 5
let seed = 0

/**
 * 删除toast
 * @param id toast的id
 */
function removeToast(id: number) {
  const index = toastList.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toastList.value.splice(index, 1)
  }
}

/**
 * 添加toast
 * @param options toast支持的选项
 */
function addToast(options: ToastOptions) {

  const id = ++seed

  const toast: ToastItem = {
    id,
    type: options.type ?? 'info',
    message: options.message,
    duration: options.duration ?? 3000
  }

  if (toastList.value.length >= MAX_TOAST) {
    toastList.value.shift()
  }

  toastList.value.push(toast)

  setTimeout(() => {
    removeToast(id)
  }, toast.duration)
}

defineExpose({
  addToast
})
</script>

<template>
  <div class="toast-list">
    <TransitionGroup tag="div" name="toast">
      <div v-for="toast in toastList" :key="toast.id" class="toast-item" :class="`toast-${toast.type}`">
        <i class="iconfont" :class="`icon-${toast.type}`"></i>
        <span>{{ toast.message }}</span>
        <i class="iconfont icon-close" @click="removeToast(toast.id)"></i>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-list {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 10px;
  background: var(--color-bg-card);
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.toast-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 6px 0 0 6px;
}

.toast-success::before {
  background: var(--toast-success);
}

.toast-info::before {
  background: var(--toast-info);
}

.toast-warn::before {
  background: var(--toast-warn);
}

.toast-success .icon-success {
  color: var(--toast-success);
}

.toast-info .icon-info {
  color: var(--toast-info);
}

.toast-warn .icon-warn {
  color: var(--toast-warn);
}

.toast-error .icon-error {
  color: var(--toast-error);
}

.toast-error::before {
  background: var(--toast-error);
}

.toast-item i:first-child {
  font-size: 14px;
  font-weight: 500;
}

.toast-item span {
  flex: 1;
}

.icon-close {
  border: none;
  background: transparent;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
