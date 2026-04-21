<script setup lang="ts">
defineProps<{
  show: boolean
  text?: string
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="page-loading-overlay">
      <div class="page-loading-content">
        <div class="page-loading-spinner"></div>
        <span class="page-loading-text">{{ text || '加载中...' }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.page-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: var(--card-bg);
  padding: 32px 48px;
  border-radius: var(--card-radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.page-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: page-spin 0.8s linear infinite;
}

.page-loading-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

@keyframes page-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
