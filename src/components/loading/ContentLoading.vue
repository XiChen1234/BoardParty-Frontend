<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '../../store/loadingStore'

defineProps<{
  show: boolean
  text?: string
}>()

const route = useRoute()
const loadingStore = useLoadingStore()

watch(() => route.path, () => {
  loadingStore.hide()
})
</script>

<template>
  <div v-if="show" class="content-loading">
    <div class="content-loading__spinner"></div>
    <span class="content-loading__text">{{ text || '加载中...' }}</span>
  </div>
</template>

<style scoped>
.content-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background-color: var(--card-bg);
  padding: 24px 32px;
  border-radius: var(--card-radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.content-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: content-spin 0.8s linear infinite;
}

.content-loading__text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

@keyframes content-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
