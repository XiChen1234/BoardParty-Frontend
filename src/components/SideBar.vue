<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)

const menuItems = [
  { id: 'add', label: '添加', icon: 'icon-add' },
  { id: 'star', label: '收藏', icon: 'icon-star' },
  { id: 'share', label: '分享', icon: 'icon-share' }
]

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleItemClick = (itemId: string) => {
  console.log('点击了菜单项:', itemId)
  isExpanded.value = false
}
</script>

<template>
  <div class="sidebar" :class="{ expanded: isExpanded }">
    <div class="menu-container">
      <div v-if="isExpanded" class="menu-items">
        <div v-for="(item, index) in menuItems" :key="item.id" class="menu-item"
          :style="{ '--delay': index * 50 + 'ms' }" @click="handleItemClick(item.id)">
          <span class="iconfont" :class="item.icon"></span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div class="toggle-btn" @click="toggleExpand">
      <span class="iconfont icon-plus" :class="{ rotated: isExpanded }"></span>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  right: 20px;
  bottom: 120px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.menu-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 16px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-bg-card);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.3s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateX(20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item:hover {
  background-color: var(--color-bg-hover);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.menu-item:active {
  transform: scale(0.95);
}

.menu-item .iconfont {
  font-size: 20px;
  color: var(--color-primary);
}

.menu-label {
  font-size: 14px;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.toggle-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--blue-500) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(58, 95, 122, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(58, 95, 122, 0.5);
}

.toggle-btn:active {
  transform: scale(0.95);
}

.toggle-btn .iconfont {
  font-size: 28px;
  color: var(--color-text-inverse);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-btn .icon-plus.rotated {
  transform: rotate(45deg);
}
</style>
