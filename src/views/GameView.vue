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
    <div class="condition-list">
      <div class="condition-item">
        <div class="label">2-4人</div>
        <div class="delete">×</div>
      </div>
      <div class="condition-item">
        <div class="label">策略</div>
        <div class="delete">×</div>
      </div>
      <div class="condition-item">
        <div class="label">简单</div>
        <div class="delete">×</div>
      </div>
    </div>
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
  padding: 8px 12px;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
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

.condition-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-card);
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
}

.condition-list .condition-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-bg-soft);
  padding: 4px 8px;
  border-radius: 5px;
}

.condition-list .condition-item:hover {
  background: var(--color-primary-hover);
  color: var(--color-text-inverse);
}

.condition-list .condition-item .delete {
  cursor: pointer;
}

.condition-list .condition-item .delete:hover {
  color: var(--color-danger);
}


@media screen and (max-width: 767px) {
  .title {
    display: none;
  }
}
</style>
