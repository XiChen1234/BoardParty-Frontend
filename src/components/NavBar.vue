<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const defaultTitle = '希晨er的桌游小圈'

const isTabPage = computed(() => {
  const tabRoutes = ['list', 'rank', 'punishment', 'profile']
  return tabRoutes.includes(route.name as string)
})

/**
 * 导航栏标题
 */
const pageTitle = computed(() => {
  if (isTabPage.value) {
    return defaultTitle
  }
  return (route.meta.title as string) || defaultTitle // 避免非tab页面没有title
})

/**
 * 是否显示返回按钮
 */
const showBack = computed(() => !isTabPage.value)

/**
 * 返回上一页
 */
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="nav-bar">
    <div class="nav-back" v-if="showBack" @click="goBack">
      <i class="iconfont icon-back"></i>
    </div>
    <!-- 中间标题 -->
    <h1 class="nav-title">{{ pageTitle }}</h1>
  </div>
</template>

<style scoped>
.nav-bar {
  height: 60px;
  background-color: var(--color-bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding-top: env(safe-area-inset-top);
  position: relative;
}

.nav-back {
  position: absolute;
  left: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back .iconfont {
  font-size: 18px;
  color: var(--color-text-primary);
}

.nav-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>
