<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroupDetail } from '@/api/groupAPI'
import { useUserStore } from '@/store/userStore'
import { UserRole } from '@/types/groupType'
import type { GroupDetail, GroupMember } from '@/types/groupType'
import ContentLoading from '@/components/loading/ContentLoading.vue'

const RoleTextMap: Record<UserRole, string> = {
  [UserRole.CREATOR]: '创建者',
  [UserRole.ADMIN]: '管理员',
  [UserRole.MEMBER]: '成员',
}

const RoleStyleMap: Record<UserRole, { background: string; color: string }> = {
  [UserRole.CREATOR]: { background: 'var(--color-accent)', color: 'var(--color-text-inverse)' },
  [UserRole.ADMIN]: { background: 'var(--color-primary)', color: 'var(--color-text-inverse)' },
  [UserRole.MEMBER]: { background: 'var(--color-bg-soft)', color: 'var(--color-text-secondary)' },
}

function getRoleText(role: UserRole): string {
  return RoleTextMap[role] ?? '成员'
}

function getRoleTagStyle(role: UserRole) {
  return RoleStyleMap[role]
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const groupDetail = ref<GroupDetail | null>(null)
const loading = ref(false)
const descExpanded = ref(false)
const descRef = ref<HTMLElement | null>(null)
const descOverflow = ref(false)

const currentUserId = computed(() => userStore.userInfo?.id)

const sortedMemberList = computed(() => {
  if (!groupDetail.value?.memberList) return []

  return [...groupDetail.value.memberList].sort((a, b) => a.role - b.role)
})

function isCurrentUser(member: GroupMember): boolean {
  return member.id === currentUserId.value
}

function checkDescOverflow() {
  if (!descRef.value) return
  const el = descRef.value
  descOverflow.value = el.scrollHeight > el.clientHeight
}

function toggleDesc() {
  descExpanded.value = !descExpanded.value
}

function goToList() {
  const id = Number(route.params.id)
  router.push(`/list?groupId=${id}`)
}

function goToRank() {
  const id = Number(route.params.id)
  router.push(`/rank?groupId=${id}`)
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    const res = await getGroupDetail(id)
    if (res.code === 0 && res.data) {
      groupDetail.value = res.data
    }
  } finally {
    loading.value = false
  }
  setTimeout(checkDescOverflow, 100)
})
</script>

<template>
  <div class="group-detail-page">
    <ContentLoading :show="loading" />

    <template v-if="groupDetail">
      <div class="group-info">
        <div class="info-row">
          <div class="group-avatar">
            <img v-if="groupDetail.avatarUrl" :src="groupDetail.avatarUrl" :alt="groupDetail.name" />
            <span v-else class="avatar-placeholder">{{ groupDetail.name.charAt(0) }}</span>
          </div>
          <div class="group-header-info">
            <h1 class="group-name">{{ groupDetail.name }}</h1>
            <div class="group-meta">
              <span>{{ groupDetail.memberCount }}人</span>
              <span class="dot">·</span>
              <span>我的身份：{{ getRoleText(groupDetail.userRole) }}</span>
            </div>
          </div>
        </div>

        <div class="group-desc-wrapper" v-if="groupDetail.description">
          <p :class="['group-desc', { expanded: descExpanded }]" ref="descRef">
            {{ groupDetail.description }}
          </p>
          <span v-if="descOverflow" class="desc-toggle" @click="toggleDesc">
            {{ descExpanded ? '收起' : '展开' }}
          </span>
        </div>
      </div>

      <div class="action-buttons">
        <div class="action-btn primary" @click="goToList">
          <span class="action-text"><span class="iconfont icon-list"></span> 列表</span>
        </div>
        <div class="action-btn secondary" @click="goToRank">
          <span class="action-text"><span class="iconfont icon-rank"></span> 排行榜</span>
        </div>
      </div>

      <div class="member-section">
        <div class="section-header">
          <span class="section-title">成员</span>
          <span class="section-count">{{ groupDetail.memberCount }}</span>
        </div>

        <div class="member-list">
          <div v-for="member in sortedMemberList" :key="member.id" class="member-item">
            <div class="member-avatar">
              <img v-if="member.avatarUrl" :src="member.avatarUrl" :alt="member.nickname" />
              <span v-else class="avatar-placeholder">{{ member.nickname.charAt(0) }}</span>
            </div>
            <span class="member-name">{{ member.nickname }}</span>
            <span v-if="member.role === 0 || member.role === 1" class="role-tag" :style="getRoleTagStyle(member.role)">
              {{ getRoleText(member.role) }}
            </span>
            <span v-if="isCurrentUser(member)" class="self-tag">我</span>
          </div>
        </div>
      </div>

      <div class="join-time">加入时间：{{ groupDetail.joinTime }}</div>
    </template>
  </div>
</template>

<style scoped>
.group-detail-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: var(--color-bg-page);
  overflow: hidden;
}

.group-info {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 16px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.group-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--card-radius);
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.group-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-inverse);
}

.group-header-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.dot {
  color: var(--color-text-tertiary);
}

.group-desc-wrapper {
  margin-top: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.group-desc {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.group-desc.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
  overflow: visible;
}

.desc-toggle {
  font-size: 13px;
  color: var(--color-primary);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
  user-select: none;
}

.action-btn:active {
  transform: scale(0.96);
  opacity: 0.9;
}

.action-btn.primary {
  background-color: var(--color-card-btn-primary);
}

.action-btn.secondary {
  background-color: var(--color-card-btn-secondary);
}

.action-text {
  font-size: 15px;
  color: var(--color-text-inverse);
}

.member-section {
  flex: 1;
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border-soft);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section-count {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.member-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: var(--color-bg-hover);
}

.member-item:active {
  background-color: var(--color-bg-soft);
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.self-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  flex-shrink: 0;
}

.join-time {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--color-text-tertiary);
  text-align: center;
}
</style>
