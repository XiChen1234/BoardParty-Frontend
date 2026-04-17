<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface TabItem {
  name: string
  label: string
  icon: string
}

const tabs: TabItem[] = [
  { name: 'list', label: '桌游', icon: 'icon-list' },
  { name: 'rank', label: '排行', icon: 'icon-rank' },
  { name: 'group', label: '小圈', icon: 'icon-group' },
  { name: 'profile', label: '我的', icon: 'icon-profile' }
]

const currentTab = computed(() => route.name as string)

const switchTab = (tabName: string) => {
  router.push({ name: tabName })
}
</script>

<template>
  <div class="tab-bar">
    <div v-for="tab in tabs" :key="tab.name" class="tab-item" :class="{ active: currentTab === tab.name }"
      @click="switchTab(tab.name)">
      <span class="tab-icon iconfont" :class="tab.icon"></span>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  height: 100px;
  background-color: var(--color-bg-card);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-icon {
  font-size: 30px;
  margin-bottom: 4px;
  color: var(--color-text-tertiary);
}

.tab-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.tab-item.active .tab-icon,
.tab-item.active .tab-label {
  color: var(--color-primary);
  font-weight: 500;
}
</style>
