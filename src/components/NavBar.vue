<script setup lang="ts">

</script>

<template>
  <div class="nav-bar">
    <!-- 中间标题 -->
    <div class="nav-center">
      <h1 class="nav-title">希晨er的桌游小圈</h1>
    </div>

    <!-- 右侧操作按钮 -->
    <div class="nav-right">
      <!-- 这里可以根据页面动态添加操作按钮 -->
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  height: 60px;
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
