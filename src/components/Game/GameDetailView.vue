<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Game } from '@/types/game-type'
import { fetchGames } from '@/api/game'

const route = useRoute()

const game = ref<Game | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const activeImageIndex = ref(0)

const gameId = computed(() => {
  return Number(route.params.id)
})

const hasMultipleImages = computed(() => {
  return game.value && game.value.images && game.value.images.length > 1
})

const setActiveImage = (index: number) => {
  activeImageIndex.value = index
}

const scoreToStars = (score: number) => ({
  full: Math.floor(score / 2),
  half: score % 2,
  empty: 5 - Math.floor(score / 2) - (score % 2)
})

const loadGameDetail = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const games = await fetchGames()
    const foundGame = games.find(g => g.id === gameId.value)
    if (foundGame) {
      game.value = foundGame
    } else {
      errorMessage.value = '未找到该游戏'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '获取游戏详情失败'
    console.error('获取游戏详情失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadGameDetail()
})
</script>

<template>
  <div class="game-detail-page">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div v-else-if="errorMessage" class="error-state">
      <div class="error-message">{{ errorMessage }}</div>
      <button class="retry-btn" @click="loadGameDetail">重试</button>
    </div>

    <template v-else-if="game">
      <div class="detail-content">
        <div class="image-gallery" v-if="game.images && game.images.length > 0">
          <div class="main-image">
            <img :src="game.images[activeImageIndex]" :alt="game.name" />
          </div>
          <div class="thumbnail-list" v-if="hasMultipleImages">
            <div v-for="(img, index) in game.images" :key="index" class="thumbnail"
              :class="{ active: activeImageIndex === index }" @click="setActiveImage(index)">
              <img :src="img" :alt="`${game.name} - 图片 ${index + 1}`" />
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="game-title-row">
            <h2 class="game-name">{{ game.name }}</h2>
            <div class="rating">
              <i class="iconfont icon-star-full" v-for="i in scoreToStars(game.star).full" :key="'full-' + i"></i>
              <i class="iconfont icon-star-half" v-for="i in scoreToStars(game.star).half" :key="'half-' + i"></i>
              <i class="iconfont icon-star-empty" v-for="i in scoreToStars(game.star).empty" :key="'empty-' + i"></i>
              <span class="rating-score">{{ game.star.toFixed(1) }}</span>
            </div>
          </div>

          <div class="tags">
            <span class="tag" v-for="tag in game.tags" :key="tag.id">{{ tag.name }}</span>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <i class="iconfont icon-user stat-icon"></i>
              <div class="stat-content">
                <span class="stat-label">玩家人数</span>
                <span class="stat-value">{{ game.minPlayer }}-{{ game.maxPlayer }}人</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="iconfont icon-time stat-icon"></i>
              <div class="stat-content">
                <span class="stat-label">游戏时长</span>
                <span class="stat-value">约{{ game.duration }}分钟</span>
              </div>
            </div>
          </div>
        </div>

        <div class="description-section">
          <h3 class="section-title">游戏介绍</h3>
          <p class="description-text">{{ game.description }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.game-detail-page {
  min-height: 100%;
  background: var(--color-bg-page);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.error-message {
  font-size: 14px;
  color: var(--color-danger);
  text-align: center;
}

.retry-btn {
  padding: 8px 24px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.retry-btn:hover {
  background: var(--color-primary-hover);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-soft);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-primary-hover);
}

.back-btn .iconfont {
  font-size: 20px;
  color: var(--color-text-primary);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 8px;
}

.header-placeholder {
  width: 40px;
}

.detail-content {
  padding-bottom: 24px;
}

.image-gallery {
  background: var(--color-bg-card);
}

.main-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-bg-soft);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.thumbnail-list::-webkit-scrollbar {
  display: none;
}

.thumbnail {
  width: 64px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.thumbnail.active {
  border-color: var(--color-primary);
  opacity: 1;
}

.thumbnail:hover {
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  background: var(--color-bg-card);
  padding: 16px;
  margin-top: 8px;
}

.game-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.game-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.rating .iconfont {
  font-size: 14px;
  color: var(--color-accent);
}

.rating .iconfont.icon-star-empty {
  color: var(--gray-300);
}

.rating-score {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 12px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-soft);
  border-radius: 10px;
}

.stat-icon {
  font-size: 20px;
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.description-section {
  background: var(--color-bg-card);
  padding: 16px;
  margin-top: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.description-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 375px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .game-title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating {
    align-self: flex-end;
  }
}
</style>
