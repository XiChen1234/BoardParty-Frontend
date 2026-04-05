<script setup lang="ts">
// 桌游墙页面组件
</script>

<template>
  <div class="game-page">
    <!-- 头部 -->
    <div class="header">
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜索你感兴趣的桌游">
      </div>
      <div class="features">
        <i class="iconfont icon-filter"></i>
        <i class="iconfont icon-waterfall"></i>
        <i class="iconfont icon-grid"></i>
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

.features {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.features .iconfont {
  font-size: 24px;
  padding: 5px;
}

.features .iconfont:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-text-inverse);
  border-radius: 5px;
  cursor: pointer;
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
</style>
