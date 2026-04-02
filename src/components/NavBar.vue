<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 计算页面标题
const pageTitle = computed(() => route.meta.title as string || 'BoardParty')

// 计算是否显示返回按钮
const showBackButton = computed(() => {
  // 这里可以根据路由层级或特定路由判断是否显示返回按钮
  // 目前简单判断：非 Tab 页面显示返回按钮
  const tabRoutes = ['list', 'rank', 'punishment', 'profile']
  return !tabRoutes.includes(route.name as string)
})

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="nav-bar">
    <!-- 左侧返回按钮 -->
    <div class="nav-left" v-if="showBackButton">
      <button class="back-button" @click="goBack">
        &larr;
      </button>
    </div>
    <div class="nav-left" v-else></div>

    <!-- 中间标题 -->
    <div class="nav-center">
      <h1 class="nav-title">{{ pageTitle }}</h1>
    </div>

    <!-- 右侧操作按钮 -->
    <div class="nav-right">
      <!-- 这里可以根据页面动态添加操作按钮 -->
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background-color: var(--color-card-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding-top: env(safe-area-inset-top);
}

.nav-left {
  width: 40px;
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--color-primary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-button:active {
  background-color: var(--color-primary-ultralight);
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.nav-right {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
