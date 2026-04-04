<script setup lang="ts">
// 桌游墙页面组件
</script>

<template>
  <div class="game-page">
    <!-- 头部 -->
    <div class="header">
      <h1 class="title">桌游墙</h1>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜索你感兴趣的桌游">
      </div>
      <div class="filter">
        <i class="iconfont icon-filter"></i>
      </div>
    </div>
    <!-- 已选择的条件列表 -->
    <!-- 显示方式（瀑布流、网格流） -->
    <!-- 桌游列表 -->
    <!-- 选择条件panel -->

  </div>
</template>

<style scoped>
.game-page {
  background: var(--color-bg-page);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  white-space: nowrap;
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 16px;
  padding: 8px 14px;
  background: var(--color-bg-soft);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.search:focus-within {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px var(--color-focus-bg);
}

.search .iconfont {
  color: var(--color-text-tertiary);
  font-size: 14px;
  margin-right: 8px;
}

.search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text-primary);
}

.search input::placeholder {
  color: var(--color-text-placeholder);
}

.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-primary-soft);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter:hover {
  background: var(--color-primary-border);
}

.filter .iconfont {
  font-size: 18px;
  color: var(--color-primary);
}

@media screen and (max-width: 767px) {
  .title {
    display: none;
  }
}
</style>
