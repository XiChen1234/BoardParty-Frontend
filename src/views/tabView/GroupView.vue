<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GroupFilterType, UserRole } from '@/types/groupType'
import type { GroupListItem } from '@/types/groupType'
import { getUserGroups } from '@/api/groupAPI'
import GroupListItemComponent from '@/components/group/GroupListItem.vue'
import ContentLoading from '@/components/loading/ContentLoading.vue'

const router = useRouter()
const filterType = ref<GroupFilterType>(GroupFilterType.ALL)
const groupList = ref<GroupListItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filterOptions = [
  { key: GroupFilterType.ALL, label: '全部' },
  { key: GroupFilterType.JOINED, label: '已加入' },
  { key: GroupFilterType.CREATED, label: '管理中' },
]

const filteredList = computed(() => {
  switch (filterType.value) {
    case GroupFilterType.JOINED:
      return groupList.value.filter((item) => item.userRole === UserRole.MEMBER)
    case GroupFilterType.CREATED:
      return groupList.value.filter((item) => item.userRole === UserRole.CREATOR || item.userRole === UserRole.ADMIN)
    default:
      return groupList.value
  }
})

async function fetchGroupList() {
  loading.value = true
  error.value = null
  try {
    const res = await getUserGroups()
    if (res.code === 0 && res.data) {
      groupList.value = res.data
    } else {
      error.value = res.msg || '获取小圈列表失败'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
    console.error('获取小圈列表失败:', e)
  } finally {
    loading.value = false
  }
}

function handleEnterGroup(id: number) {
  router.push(`/group/${id}`)
}

function handleCreate() {
  router.push('/group/create')
}

function scrollToTop() {
  document.querySelector('.group-content')?.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchGroupList()
})
</script>

<template>
  <div class="group-page">
    <div class="group-header">
      <h1 class="page-title">我的小圈子</h1>
      <i class="iconfont icon-add group-add" @click="handleCreate"></i>
    </div>

    <div class="filter-tabs">
      <button v-for="option in filterOptions" :key="option.key"
        :class="['filter-tab', { active: filterType === option.key }]" @click="filterType = option.key">
        {{ option.label }}
      </button>
    </div>

    <div class="group-content">
      <ContentLoading :show="loading" />
      <div v-if="error" class="group-error">
        <span>{{ error }}</span>
        <button class="retry-btn" @click="fetchGroupList">重试</button>
      </div>
      <TransitionGroup v-else-if="filteredList.length > 0" name="list">
        <GroupListItemComponent v-for="item in filteredList" :key="item.id" :item="item" @enter="handleEnterGroup" />
      </TransitionGroup>
      <div v-else class="group-empty">
        <span>暂无小圈子</span>
        <button class="empty-create-btn" @click="handleCreate">
          <i class="iconfont icon-add"></i>创建小圈子
        </button>
      </div>
    </div>

    <div class="back-to-top">
      <button class="back-btn" @click="scrollToTop">
        <i class="iconfont icon-back"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.group-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: var(--color-bg-page);
  overflow: hidden;
}

.group-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-page);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.group-add {
  font-size: 24px;
  color: var(--color-primary);
  cursor: pointer;
}

.filter-tabs {
  position: sticky;
  z-index: 99;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 4px;
}

.filter-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.filter-tab:hover {
  color: var(--color-text-primary);
}

.filter-tab.active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.group-content {
  border-radius: var(--card-radius);
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 150px;
}

.group-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  gap: 12px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.retry-btn {
  padding: 8px 16px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: var(--color-text-inverse);
  cursor: pointer;
}

.group-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  gap: 12px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.empty-create-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: var(--color-text-inverse);
  cursor: pointer;
}

.empty-create-btn .iconfont {
  font-size: 16px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-move {
  transition: transform 0.3s ease;
}

.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 200px;
  z-index: 1000;
}

.back-btn {
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
}

.back-btn:active {
  transform: scale(0.8);
}

.back-btn .iconfont {
  font-size: 28px;
  color: var(--color-text-inverse);
  transform: rotate(90deg);
}
</style>
