<script setup lang="ts">
import ContentLoading from '@/components/loading/ContentLoading.vue';
import { useUserStore } from '@/store/userStore';
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const isLogin = computed(() => userStore.token) // 根据token判断是否已经登录
const userInfo = computed(() => userStore.userInfo) // 获取用户信息
const avatarLoadFailed = ref(false) // 头像加载失败状态
// 头像文本显示
const avatarText = computed(() => {
  if (userInfo.value?.avatarUrl && !avatarLoadFailed.value) {
    return ''
  }
  return userInfo.value?.nickname?.charAt(0) || 'U'
})

function handleLogin() {
  router.push('/login')
}
function handleLogout() {
  userStore.logoutAction()
}
function handleAvatarError() {
  avatarLoadFailed.value = true
}

// loading相关
const loading = ref(false)
onMounted(async () => {
  if (!isLogin.value || userInfo.value?.id) {
    return
  }

  loading.value = true
  try {
    await userStore.fetchUserInfoAction()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile-page">
    <ContentLoading :show="loading"></ContentLoading>
    <div v-if="!isLogin">
      <div class="profile-header">
        <div class="avatar-wrapper">
          <div class="avatar">
            <span class="avatar-placeholder">U</span>
          </div>
          <div class="user-info">
            <h2 class="nickname">登录后查看更多内容</h2>
            <button class="login-button" @click="handleLogin">登录 / 注册</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 已登录页面样式 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <div class="avatar">
            <img v-if="userInfo?.avatarUrl && !avatarLoadFailed" :src="userInfo.avatarUrl" alt="avatar"
              class="avatar-img" @error="handleAvatarError" />
            <span v-else class="avatar-placeholder">{{ avatarText }}</span>
          </div>
          <div class="user-info">
            <h2 class="nickname">{{ userInfo?.nickname || '未知用户' }}</h2>
            <p class="username">@{{ userInfo?.username || 'username' }}</p>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="card-title">游戏统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">0</span>
            <span class="stat-label">总场次</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">0%</span>
            <span class="stat-label">胜率</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">0</span>
            <span class="stat-label">胜利</span>
          </div>
        </div>
      </div>

      <div class="menu-card">
        <div class="menu-item">
          <span class="menu-icon iconfont icon-edit"></span>
          <span class="menu-label">编辑个人资料</span>
          <span class="menu-arrow iconfont icon-arrow-right"></span>
        </div>
        <div class="menu-item">
          <span class="menu-icon iconfont icon-lock"></span>
          <span class="menu-label">修改密码</span>
          <span class="menu-arrow iconfont icon-arrow-right"></span>
        </div>
        <div class="menu-item">
          <span class="menu-icon iconfont icon-info"></span>
          <span class="menu-label">关于</span>
          <span class="menu-arrow iconfont icon-arrow-right"></span>
        </div>
      </div>

      <button class="logout-button" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 16px;
  background-color: var(--color-bg-page);
}

/* 已登录样式 - 头像区域 */
.profile-header {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 16px;
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

.login-button {
  margin-top: 4px;
  padding: 6px 16px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-inverse);
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.login-button:hover {
  background-color: var(--color-primary-dark);
}

.login-button:active {
  transform: scale(0.98);
}

/* 统计卡片 */
.stats-card {
  background-color: var(--color-bg-card);
  border-radius: var(--card-radius);
  padding: 16px;
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

/* 菜单卡片 */
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
  padding: 12px;
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

/* 退出登录按钮 */
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
