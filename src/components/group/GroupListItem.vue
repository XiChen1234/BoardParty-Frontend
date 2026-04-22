<script setup lang="ts">
import type { GroupListItem } from '@/types/groupType'
import { UserRole } from '@/types/groupType'

defineProps<{
  item: GroupListItem
}>()

const emit = defineEmits<{
  enter: [id: number]
}>()

function getRoleText(role: UserRole): string {
  switch (role) {
    case UserRole.CREATOR:
      return '创建者'
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.MEMBER:
      return '成员'
    default:
      return '成员'
  }
}
</script>

<template>
  <div class="group-list-item" @click="emit('enter', item.id)">
    <div class="item-avatar">
      <img v-if="item.avatarUrl" :src="item.avatarUrl" :alt="item.name" />
      <span v-else class="avatar-placeholder">{{ item.name.charAt(0) }}</span>
    </div>
    <div class="item-content">
      <div class="item-header">
        <span class="item-name">{{ item.name }}</span>
        <span class="user-role">角色：{{ getRoleText(item.userRole) }}</span>
      </div>
      <div class="item-info">
        <span class="item-desc" v-if="item.description">{{ item.description }}</span>
        <span class="member-count">
          <i class="iconfont icon-user"></i>
          {{ item.memberCount }}人
        </span>
      </div>
    </div>
    <span class="item-arrow iconfont icon-arrow-right"></span>
  </div>
</template>

<style scoped>
.group-list-item {
  background-color: var(--color-bg-card);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.group-list-item:hover {
  background-color: var(--color-bg-hover);
}

.group-list-item:active {
  background-color: var(--color-bg-soft);
}

.item-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-inverse);
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-count {
  font-size: 13px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.join-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-align: center;
}

.user-role {
  font-size: 13px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.item-desc {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-tertiary);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.item-arrow {
  font-size: 14px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
</style>
