<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tag, Condition } from '@/types/game-type'
import { gameList, tagList } from '@/data/game'

// 控制列表模式：瀑布流、列表
const listMode = ref('waterfall')

/* ====================================
   条件列表管理
   ==================================== */
const conditionList = ref<Condition[]>([])
const playerCountValue = ref('') // 玩家人数输入框的值

/**
 * 根据条件类型获取条件对象
 * @param type 条件类型
 * @returns 条件对象或undefined
 */
const getConditionByType = (type: Condition['type']): Condition | undefined => {
  return conditionList.value.find(c => c.type === type)
}

/**
 * 判断某种类型的条件是否存在
 * @param type 条件类型
 * @param value 可选的条件值
 * @returns 是否存在
 */
const hasCondition = (type: Condition['type'], value?: string | number): boolean => {
  return conditionList.value.some(c => {
    if (c.type !== type) return false
    if (value !== undefined && c.value !== value) return false
    return true
  })
}

/**
 * 添加条件到条件列表
 * @param condition 条件对象
 */
const addCondition = (condition: Condition) => {
  conditionList.value.push(condition)
}

/**
 * 根据条件类型和值移除条件，如果未指定值，则移除所有该类型的条件
 * @param type 条件类型
 * @param value 条件值
 */
const removeCondition = (type: Condition['type'], value?: string | number) => {
  for (let i = 0; i < conditionList.value.length; i++) {
    const condition = conditionList.value[i]
    if (condition && condition.type === type) {
      if (value === undefined || condition.value === value) {
        conditionList.value.splice(i, 1)
      }
    }
  }
}

/**
 * 清除所有条件
 */
const clearAllConditions = () => {
  conditionList.value = []
}

/**
 * 获取条件列表的标签显示文本
 * @param condition 条件对象
 * @returns 显示文本
 */
const getConditionLabel = (condition: Condition): string => {
  switch (condition.type) {
    case 'playerCount':
      return `${condition.value}人`
    case 'playerRange':
      const rangeLabels: Record<string, string> = {
        '2-4': '2-4人',
        '5-8': '5-8人',
        '9+': '9人以上'
      }
      return rangeLabels[condition.value as string] || ''
    case 'duration':
      const durationLabels: Record<string, string> = {
        '<30': '30分钟以内',
        '30-60': '30-60分钟',
        '>60': '60分钟以上'
      }
      return durationLabels[condition.value as string] || ''
    case 'tag':
      return condition.label
    default:
      return ''
  }
}

/* ====================================
   条件面板显示状态
   ==================================== */
const isConditionPanelVisible = ref(false)

const games = computed(() => gameList.value)

/* ====================================
   筛选选项配置
   ==================================== */
const playerRangeOptions = [
  { label: '全部', value: 'all' },
  { label: '2-4人', value: '2-4' },
  { label: '5-8人', value: '5-8' },
  { label: '9人以上', value: '9+' }
]

const durationOptions = [
  { label: '全部', value: 'all' },
  { label: '30分钟以内', value: '<30' },
  { label: '30-60分钟', value: '30-60' },
  { label: '60分钟以上', value: '>60' }
]

const tagOptions = computed(() => tagList.value)

/* ====================================
   筛选操作函数
   ==================================== */

/**
 * 玩家人数输入框改变时的回调处理
 */
const handlePlayerCountInput = () => {
  const value = parseInt(playerCountValue.value, 10)

  if (value > 0) {
    removeCondition('playerRange')
    removeCondition('playerCount')
    addCondition({ type: 'playerCount', label: `${value}人`, value })
  } else {
    removeCondition('playerCount')
  }
}

/**
 * 玩家人数范围快捷选项点击处理
 * @param value 范围值
 */
const handlePlayerRangeClick = (value: string) => {
  // 清除input输入框
  playerCountValue.value = ''
  if (value === 'all') {
    removeCondition('playerRange')
    removeCondition('playerCount')
  } else {
    removeCondition('playerCount')
    removeCondition('playerRange')
    const labels: Record<string, string> = {
      '2-4': '2-4人',
      '5-8': '5-8人',
      '9+': '9人以上'
    }
    addCondition({ type: 'playerRange', label: labels[value] || value, value })
  }
}

/**
 * 持续时间筛选改变时的处理
 * @param value 持续时间值
 */
const handleDurationClick = (value: string) => {
  if (value === 'all') {
    removeCondition('duration')
  } else {
    removeCondition('duration')
    const labels: Record<string, string> = {
      '<30': '30分钟以内',
      '30-60': '30-60分钟',
      '>60': '60分钟以上'
    }
    addCondition({ type: 'duration', label: labels[value] || value, value })
  }
}

/**
 * 标签筛选改变时的处理
 * @param tag 标签对象
 */
const handleTagClick = (tag: Tag) => {
  const tagName = tag.name
  if (hasCondition('tag', tagName)) {
    removeCondition('tag', tagName)
  } else {
    addCondition({ type: 'tag', label: tagName, value: tagName })
  }
}

/**
 * 判断标签是否被选中
 * @param tag 标签对象
 * @returns 是否选中
 */
const isTagSelected = (tag: Tag): boolean => {
  return hasCondition('tag', tag.name)
}

/* ====================================
   筛选结果计算
   ==================================== */

const filteredGames = computed(() => {
  return games.value.filter(game => {
    // 玩家人数筛选（输入框优先于快捷选项）
    const playerCondition = getConditionByType('playerCount')
    if (playerCondition) {
      const count = playerCondition.value as number
      if (game.minPlayer > count || game.maxPlayer < count) {
        return false
      }
    } else {
      const rangeCondition = getConditionByType('playerRange')
      if (rangeCondition) {
        const range = rangeCondition.value as string
        if (range === '2-4' && (game.minPlayer < 2 || game.maxPlayer > 4)) {
          return false
        }
        if (range === '5-8' && (game.minPlayer < 5 || game.maxPlayer > 8)) {
          return false
        }
        if (range === '9+' && game.maxPlayer < 9) {
          return false
        }
      }
    }

    // 持续时间筛选
    const durationCondition = getConditionByType('duration')
    if (durationCondition && game.duration) {
      const dur = game.duration
      const durValue = durationCondition.value as string
      if (durValue === '<30' && dur >= 30) {
        return false
      }
      if (durValue === '30-60' && (dur < 30 || dur > 60)) {
        return false
      }
      if (durValue === '>60' && dur <= 60) {
        return false
      }
    }

    // 标签筛选（且的关系）
    const tagConditions = conditionList.value.filter(c => c.type === 'tag')
    if (tagConditions.length > 0) {
      const gameTagNames = game.tags.map(t => t.name)
      const hasAllTags = tagConditions.every(tagCond => gameTagNames.includes(tagCond.value as string))
      if (!hasAllTags) {
        return false
      }
    }

    return true
  })
})

/* ====================================
   工具函数
   ==================================== */

/**
 * 将评分转换为星数
 * @param score 评分
 * @returns 星数
 */
const scoreToStars = (score: number) => ({
  full: Math.floor(score / 2),
  half: score % 2,
  empty: 5 - Math.floor(score / 2) - (score % 2)
})
</script>

<template>
  <div class="game-page">
    <!-- 头部 -->
    <div class="top-header">
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜索你感兴趣的桌游">
      </div>
      <div class="features">
        <i class="iconfont icon-filter" @click="isConditionPanelVisible = !isConditionPanelVisible"></i>
        <i class="iconfont icon-waterfall" v-if="listMode === 'waterfall'" @click="listMode = 'grid'"></i>
        <i class="iconfont icon-grid" v-else-if="listMode === 'grid'" @click="listMode = 'waterfall'"></i>
      </div>
    </div>
    <!-- 已选择的条件列表 -->
    <div class="condition-list" v-if="conditionList.length > 0">
      <div v-for="item in conditionList" :key="item.type + '-' + item.value" class="condition-item">
        <div class="label">{{ getConditionLabel(item) }}</div>
        <div class="delete" @click="removeCondition(item.type, item.value)">×</div>
      </div>
      <div class="clear-all" @click="clearAllConditions" v-if="conditionList.length > 1">清除全部</div>
    </div>
    <!-- 桌游列表 -->
    <div class="game-list grid" v-if="listMode === 'grid'">
      <div class="game-item" v-for="game in filteredGames" :key="game.id">
        <div class="image">
          <img :src="game.icon" :alt="game.name">
        </div>
        <div class="content">
          <div class="header">
            <h3 class="title">{{ game.name }}</h3>
            <div class="rating">
              <i class="iconfont icon-star-full" v-for="i in scoreToStars(game.star).full" :key="i"></i>
              <i class="iconfont icon-star-half" v-for="i in scoreToStars(game.star).half" :key="i"></i>
              <i class="iconfont icon-star-empty" v-for="i in scoreToStars(game.star).empty" :key="i"></i>
            </div>
          </div>
          <div class="tags">
            <span class="tag" v-for="tag in game.tags" :key="tag.id">{{ tag.name }}</span>
            <span class="tag">{{ game.minPlayer }}-{{ game.maxPlayer }}人</span>
          </div>
        </div>
      </div>
    </div>
    <div class="game-list waterfall" v-else>
      <div class="game-item" v-for="game in filteredGames" :key="game.id">
        <div class="image">
          <img :src="game.icon" :alt="game.name">
        </div>
        <div class="content">
          <div class="header">
            <h3 class="title">{{ game.name }}</h3>
            <div class="rating">
              <i class="iconfont icon-star-full" v-for="i in scoreToStars(game.star).full" :key="i"></i>
              <i class="iconfont icon-star-half" v-for="i in scoreToStars(game.star).half" :key="i"></i>
              <i class="iconfont icon-star-empty" v-for="i in scoreToStars(game.star).empty" :key="i"></i>
            </div>
          </div>
          <div class="tags">
            <span class="tag" v-for="tag in game.tags" :key="tag.id">{{ tag.name }}</span>
          </div>
          <div class="description">
            <p>{{ game.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择条件panel -->
    <div class="condition-panel" v-if="isConditionPanelVisible">
      <div class="panel-overlay" @click="isConditionPanelVisible = false"></div>
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">筛选条件</h3>
          <i class="iconfont icon-close panel-close" @click="isConditionPanelVisible = false"></i>
        </div>
        <div class="panel-content">
          <!-- 玩家人数筛选 -->
          <div class="filter-group">
            <div class="filter-label">玩家人数</div>
            <div class="player-count-input">
              <input v-model="playerCountValue" type="number" placeholder="输入人数" min="1"
                @input="handlePlayerCountInput" />
              <span class="input-suffix">人</span>
            </div>
            <div class="filter-options">
              <span v-for="option in playerRangeOptions" :key="option.value" class="filter-option"
                :class="{ active: hasCondition('playerRange', option.value) || (option.value === 'all' && !hasCondition('playerCount') && !hasCondition('playerRange')) }"
                @click="handlePlayerRangeClick(option.value)">{{ option.label }}</span>
            </div>
          </div>
          <!-- 持续时间筛选 -->
          <div class="filter-group">
            <div class="filter-label">持续时间</div>
            <div class="filter-options">
              <span v-for="option in durationOptions" :key="option.value" class="filter-option"
                :class="{ active: hasCondition('duration', option.value) || (option.value === 'all' && !hasCondition('duration')) }"
                @click="handleDurationClick(option.value)">{{ option.label }}</span>
            </div>
          </div>
          <!-- 标签筛选 -->
          <div class="filter-group">
            <div class="filter-label">游戏标签（多选）</div>
            <div class="filter-options">
              <span class="filter-option" :class="{ active: !hasCondition('tag') }">全部</span>
              <span v-for="tag in tagOptions" :key="tag.id" class="filter-option"
                :class="{ active: isTagSelected(tag) }" @click="handleTagClick(tag)">{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-page {
  background: var(--color-bg-page);
}

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 16px;
  padding: 8px 12px;
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

.condition-list .clear-all {
  padding: 4px 12px;
  color: var(--color-primary);
  font-size: 13px;
  cursor: pointer;
  margin-left: auto;
}

.condition-list .clear-all:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.game-list {
  padding: 12px;
  background: var(--color-bg-page);
}

.game-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.game-list.waterfall {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.game-item {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  border: 1px solid var(--card-border);
  overflow: hidden;
}

.grid .game-item {
  display: flex;
  flex-direction: column;
}

.waterfall .game-item {
  display: flex;
  flex-direction: row;
}

.image {
  overflow: hidden;
  background: var(--color-bg-soft);
}

.grid .image {
  width: 100%;
  height: 100px;
}

.waterfall .image {
  width: 100px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.waterfall .content {
  flex: 1;
  justify-content: center;
}

.waterfall .title {
  font-size: 20px;
  white-space: normal;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.waterfall .rating {
  gap: 2px;
}

.waterfall .rating .iconfont {
  font-size: 14px;
}

.waterfall .tags {
  gap: 6px;
  margin-bottom: 12px;
}

.waterfall .tags .tag {
  padding: 4px 10px;
  font-size: 12px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
}

.rating .iconfont {
  font-size: 10px;
  color: var(--color-accent);
}

.rating .iconfont.icon-star-empty {
  color: var(--gray-300);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tags .tag {
  padding: 2px 6px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
}

.grid .description {
  display: none;
}

.waterfall .description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-tertiary);
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* ====================================
   选择条件面板
   ==================================== */
.condition-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.panel {
  position: relative;
  width: 100%;
  max-width: 100%;
  max-height: 80vh;
  background: var(--color-bg-card);
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.panel-close {
  font-size: 24px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
}

.panel-close:hover {
  color: var(--color-text-primary);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-option {
  padding: 8px 16px;
  background: var(--color-bg-soft);
  color: var(--color-text-secondary);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-option:hover {
  background: var(--color-primary-hover);
  color: var(--color-text-inverse);
}

.filter-option.active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.player-count-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.player-count-input input {
  flex: 1;
  max-width: 100px;
  padding: 8px 12px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.player-count-input input:focus {
  border-color: var(--color-primary);
}

.player-count-input input::placeholder {
  color: var(--color-text-placeholder);
}

.player-count-input input::-webkit-outer-spin-button,
.player-count-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.player-count-input .input-suffix {
  font-size: 14px;
  color: var(--color-text-tertiary);
}
</style>
