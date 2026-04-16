<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { Gender } from '@/types/userType'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'


const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

onMounted(async () => {
  if (!userInfo.value) {
    await userStore.fetchUserInfo()
  }
})

const handleLogout = () => {
  console.log('退出登录')
  userStore.logout()
  router.push('/login')
}

const handleMenuClick = (name: string) => {
  console.log('点击菜单:', name)
}
</script>

<template>
  <!-- TODO: 后期补Loading -->
  <div v-if="!userInfo">加载中</div>
  <div v-else>
    <div class="profile-header">
      <div class="avatar-wrapper">
        <div class="avatar">
          <span v-if="!userInfo.avatar_url" class="avatar-placeholder">
            {{ userInfo.nickname?.charAt(0).toUpperCase() }}
          </span>
          <img v-else :src="userInfo.avatar_url" :alt="userInfo.nickname" class="avatar-img" />
        </div>
        <div class="user-info">
          <h2 class="nickname">{{ userInfo.nickname }}</h2>
          <p class="username">@{{ userInfo.username }}</p>
          <i class="iconfont icon-default" v-if="userInfo.gender === Gender.default" />
          <i class="iconfont icon-male" v-else-if="userInfo.gender === Gender.male" />
          <i class="iconfont icon-female" v-else-if="userInfo.gender === Gender.female" />
        </div>
      </div>
    </div>

    <div class="stats-card">
      <h3 class="card-title">游戏统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">120</span>
          <span class="stat-label">总场次</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">100%</span>
          <span class="stat-label">胜率</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">100</span>
          <span class="stat-label">胜利</span>
        </div>
      </div>
    </div>

    <div class="menu-card">
      <div class="menu-item" @click="handleMenuClick('edit')">
        <span class="menu-icon iconfont icon-edit"></span>
        <span class="menu-label">编辑个人资料</span>
        <span class="menu-arrow iconfont icon-arrow-right"></span>
      </div>
      <div class="menu-item" @click="handleMenuClick('password')">
        <span class="menu-icon iconfont icon-lock"></span>
        <span class="menu-label">修改密码</span>
        <span class="menu-arrow iconfont icon-arrow-right"></span>
      </div>
      <div class="menu-item" @click="handleMenuClick('about')">
        <span class="menu-icon iconfont icon-info"></span>
        <span class="menu-label">关于</span>
        <span class="menu-arrow iconfont icon-arrow-right"></span>
      </div>
    </div>

    <button class="logout-button" @click="handleLogout">退出登录</button>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 16px;
  padding-bottom: 100px;
  background-color: var(--color-bg-page);
}

.profile-header {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 24px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-placeholder {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-inverse);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.username {
  font-size: 14px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.rank-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--color-primary-soft);
  border-radius: 12px;
}

.rank-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.rank-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.stats-card {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: var(--color-border);
}

.menu-card {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--color-border-soft);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: var(--color-bg-hover);
}

.menu-item:active {
  background-color: var(--color-bg-soft);
}

.menu-icon {
  font-size: 20px;
  color: var(--color-primary);
  margin-right: 14px;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  color: var(--color-text-primary);
}

.menu-arrow {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.logout-button {
  width: 100%;
  padding: 14px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-danger);
  border-radius: var(--card-radius);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-danger);
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background-color: var(--color-danger-bg);
}

.logout-button:active {
  transform: scale(0.98);
}
</style>
