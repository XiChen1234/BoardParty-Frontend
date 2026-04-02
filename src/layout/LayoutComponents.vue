<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import TabBar from '../components/TabBar.vue'

const route = useRoute()

// 计算当前是否为 Tab 页面
const isTabPage = computed(() => {
  const tabRoutes = ['list', 'rank', 'punishment', 'profile']
  return tabRoutes.includes(route.name as string)
})
</script>

<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <NavBar />

    <!-- 主内容区 -->
    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部 Tab 栏 -->
    <TabBar v-if="isTabPage" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-color: var(--color-background);
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
