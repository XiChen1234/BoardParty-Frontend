<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.push({ name: 'punishment' })
}
</script>

<template>
  <div class="sidebar">
    <button class="toggle-btn" @click="handleClick">
      <span class="iconfont icon-random"></span>
    </button>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  right: 20px;
  bottom: 120px;
  z-index: 1000;
}

.toggle-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--blue-500) 100%);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(58, 95, 122, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.toggle-btn:active {
  transform: scale(0.8);
}

.toggle-btn:focus {
  outline: none;
}

.toggle-btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.toggle-btn .iconfont {
  font-size: 28px;
  color: #ffffff;
}
</style>
