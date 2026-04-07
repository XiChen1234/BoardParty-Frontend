<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tag, Condition } from '@/types/game-type'
import { gameList, tagList } from '@/data/game'

/* ====================================
   常量定义
   ==================================== */

/**
 * 筛选条件类型枚举
 */
const ConditionType = {
  PLAYER_COUNT: 'playerCount',
  PLAYER_RANGE: 'playerRange',
  DURATION: 'duration',
  TAG: 'tag',
  SEARCH: 'search'
} as const

/**
 * 玩家人数范围选项配置
 */
const playerRangeOptions = [
  { label: '全部', value: 'all' },
  { label: '2-4人', value: '2-4', min: 2, max: 4 },
  { label: '5-8人', value: '5-8', min: 5, max: 8 },
  { label: '9人以上', value: '9+', min: 9, max: Infinity }
]

/**
 * 持续时间选项配置
 */
const durationOptions = [
  { label: '全部', value: 'all' },
  { label: '30分钟以内', value: '<30', min: 0, max: 30 },
  { label: '30-60分钟', value: '30-60', min: 30, max: 60 },
  { label: '60分钟以上', value: '>60', min: 60, max: Infinity }
]

/* ====================================
   状态定义
   ==================================== */

// 控制列表模式：瀑布流、列表
const listMode = ref('waterfall')

// 条件列表 - 存储所有筛选条件
const conditionList = ref<Condition[]>([])

// 搜索关键词
const searchKeyword = ref('')

// 玩家人数输入框的值（使用number类型避免类型转换）
const playerCountValue = ref<number | null>(null)

// 条件面板显示状态
const isConditionPanelVisible = ref(false)

// 游戏列表数据，从后端获取
const games = computed(() => gameList.value)

// 标签选项，从后端获取
const tagOptions = computed(() => tagList.value)

/* ====================================
   条件管理函数
   ==================================== */

/**
 * 根据条件类型获取条件对象
 * @param type - 条件类型
 * @returns 条件对象或undefined
 */
const getConditionByType = (type: Condition['type']): Condition | undefined => {
  return conditionList.value.find(c => c.type === type)
}

/**
 * 判断某种类型的条件是否存在
 * @param type - 条件类型
 * @param value - 可选的条件值
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
 * @param condition - 条件对象
 */
const addCondition = (condition: Condition) => {
  conditionList.value.push(condition)
}

/**
 * 移除指定类型的全部条件（使用filter避免循环删除的索引问题）
 * @param type - 条件类型
 */
const removeConditionsByType = (type: Condition['type']) => {
  conditionList.value = conditionList.value.filter(c => c.type !== type)
}

/**
 * 根据条件类型和值移除条件
 * @param type - 条件类型
 * @param value - 条件值
 */
const removeCondition = (type: Condition['type'], value?: string | number) => {
  conditionList.value = conditionList.value.filter(c => {
    if (c.type !== type) return true
    if (value !== undefined && c.value !== value) return true
    return false
  })
}

/**
 * 清除所有条件和重置状态
 * 包括：条件列表、搜索关键词、玩家人数输入框
 */
const clearAllConditions = () => {
  conditionList.value = []
  searchKeyword.value = ''
  playerCountValue.value = null
}

/* ====================================
   标签显示文本映射
   ==================================== */

/**
 * 玩家人数范围的显示标签映射
 */
const playerRangeLabels: Record<string, string> = {
  '2-4': '2-4人',
  '5-8': '5-8人',
  '9+': '9人以上'
}

/**
 * 持续时间的显示标签映射
 */
const durationLabels: Record<string, string> = {
  '<30': '30分钟以内',
  '30-60': '30-60分钟',
  '>60': '60分钟以上'
}

/**
 * 获取条件列表项的显示文本
 * @param condition - 条件对象
 * @returns 格式化的显示文本
 */
const getConditionLabel = (condition: Condition): string => {
  switch (condition.type) {
    case ConditionType.PLAYER_COUNT:
      return `${condition.value}人`
    case ConditionType.PLAYER_RANGE:
      return playerRangeLabels[condition.value as string] || ''
    case ConditionType.DURATION:
      return durationLabels[condition.value as string] || ''
    case ConditionType.TAG:
      return condition.label
    default:
      return ''
  }
}

/* ====================================
   筛选操作函数
   ==================================== */

/**
 * 玩家人数输入框改变时的回调处理
 * 输入值会同时添加到conditionList中进行筛选
 */
const handlePlayerCountInput = () => {
  // 移除可能存在的范围条件（输入框和范围选项互斥）
  removeConditionsByType(ConditionType.PLAYER_RANGE)

  if (playerCountValue.value !== null && playerCountValue.value > 0) {
    removeConditionsByType(ConditionType.PLAYER_COUNT)
    addCondition({
      type: ConditionType.PLAYER_COUNT,
      label: `${playerCountValue.value}人`,
      value: playerCountValue.value
    })
  } else {
    removeConditionsByType(ConditionType.PLAYER_COUNT)
  }
}

/**
 * 玩家人数范围快捷选项点击处理
 * 点击时会清除输入框的内容
 * @param value - 范围值
 */
const handlePlayerRangeClick = (value: string) => {
  // 清除input输入框
  playerCountValue.value = null

  if (value === 'all') {
    removeConditionsByType(ConditionType.PLAYER_RANGE)
    removeConditionsByType(ConditionType.PLAYER_COUNT)
  } else {
    removeConditionsByType(ConditionType.PLAYER_COUNT)
    removeConditionsByType(ConditionType.PLAYER_RANGE)
    addCondition({
      type: ConditionType.PLAYER_RANGE,
      label: playerRangeLabels[value] || value,
      value
    })
  }
}

/**
 * 持续时间筛选改变时的处理
 * @param value - 持续时间值
 */
const handleDurationClick = (value: string) => {
  if (value === 'all') {
    removeConditionsByType(ConditionType.DURATION)
  } else {
    removeConditionsByType(ConditionType.DURATION)
    addCondition({
      type: ConditionType.DURATION,
      label: durationLabels[value] || value,
      value
    })
  }
}

/**
 * 标签筛选改变时的处理（多选）
 * @param tag - 标签对象
 */
const handleTagClick = (tag: Tag) => {
  const tagName = tag.name
  if (hasCondition(ConditionType.TAG, tagName)) {
    removeCondition(ConditionType.TAG, tagName)
  } else {
    addCondition({
      type: ConditionType.TAG,
      label: tagName,
      value: tagName
    })
  }
}

/**
 * 判断标签是否被选中
 * @param tag - 标签对象
 * @returns 是否选中
 */
const isTagSelected = (tag: Tag): boolean => {
  return hasCondition(ConditionType.TAG, tag.name)
}

/* ====================================
   筛选结果计算
   ==================================== */

/**
 * 根据玩家人数条件判断游戏是否匹配
 * @param game - 游戏对象
 * @returns 是否匹配
 */
const matchPlayerCondition = (game: { minPlayer: number; maxPlayer: number }): boolean => {
  // 优先检查精确人数条件
  const playerCondition = getConditionByType(ConditionType.PLAYER_COUNT)
  if (playerCondition) {
    const count = playerCondition.value as number
    return game.minPlayer <= count && game.maxPlayer >= count
  }

  // 其次检查范围条件
  const rangeCondition = getConditionByType(ConditionType.PLAYER_RANGE)
  if (rangeCondition) {
    const range = rangeCondition.value as string
    const rangeOption = playerRangeOptions.find(opt => opt.value === range)
    if (rangeOption && 'min' in rangeOption && 'max' in rangeOption) {
      return game.maxPlayer >= (rangeOption.min ?? 0) && game.minPlayer <= (rangeOption.max ?? Infinity)
    }
  }

  return true
}

/**
 * 根据持续时间条件判断游戏是否匹配
 * @param game - 游戏对象
 * @returns 是否匹配
 */
const matchDurationCondition = (game: { duration?: number }): boolean => {
  const durationCondition = getConditionByType(ConditionType.DURATION)
  if (!durationCondition || !game.duration) return true

  const dur = game.duration
  const durValue = durationCondition.value as string
  const durationOption = durationOptions.find(opt => opt.value === durValue)

  if (durationOption && 'min' in durationOption && 'max' in durationOption) {
    return dur >= (durationOption.min ?? 0) && dur < (durationOption.max ?? Infinity)
  }

  return true
}

/**
 * 根据标签条件判断游戏是否匹配
 * 要求游戏包含所有选中的标签（且的关系）
 * @param game - 游戏对象
 * @returns 是否匹配
 */
const matchTagCondition = (game: { tags: { name: string }[] }): boolean => {
  const tagConditions = conditionList.value.filter(c => c.type === ConditionType.TAG)
  if (tagConditions.length === 0) return true

  const gameTagNames = game.tags.map(t => t.name)
  return tagConditions.every(tagCond => gameTagNames.includes(tagCond.value as string))
}

/**
 * 根据搜索关键词判断游戏是否匹配
 * 支持游戏名称模糊匹配（忽略大小写）
 * @param game - 游戏对象
 * @returns 是否匹配
 */
const matchSearchCondition = (game: { name: string }): boolean => {
  if (!searchKeyword.value.trim()) return true
  const keyword = searchKeyword.value.toLowerCase().trim()
  return game.name.toLowerCase().includes(keyword)
}

/**
 * 筛选后的游戏列表
 * 使用组合模式，将各条件判断逻辑分离为独立函数
 */
const filteredGames = computed(() => {
  return games.value.filter(game => {
    return (
      matchPlayerCondition(game) &&
      matchDurationCondition(game) &&
      matchTagCondition(game) &&
      matchSearchCondition(game)
    )
  })
})

/* ====================================
   工具函数
   ==================================== */

/**
 * 将评分转换为星数显示
 * 评分范围0-10，转换为5颗星（满星、半星、空星）
 * @param score - 游戏评分（0-10）
 * @returns 包含满星、半星、空星数量的对象
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
        <input v-model="searchKeyword" type="text" placeholder="搜索你感兴趣的桌游" />
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
                :class="{ active: hasCondition(ConditionType.PLAYER_RANGE, option.value) || (option.value === 'all' && !hasCondition(ConditionType.PLAYER_COUNT) && !hasCondition(ConditionType.PLAYER_RANGE)) }"
                @click="handlePlayerRangeClick(option.value)">{{ option.label }}</span>
            </div>
          </div>
          <!-- 持续时间筛选 -->
          <div class="filter-group">
            <div class="filter-label">持续时间</div>
            <div class="filter-options">
              <span v-for="option in durationOptions" :key="option.value" class="filter-option"
                :class="{ active: hasCondition(ConditionType.DURATION, option.value) || (option.value === 'all' && !hasCondition(ConditionType.DURATION)) }"
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
