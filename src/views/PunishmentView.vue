<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Punishment {
  id: number
  icon: string
  name: string
  content: string
}

const punishmentLibrary: Punishment[] = [
  { id: 1, icon: '🍺', name: '干杯一杯', content: '举起你的酒杯，为这场失败干一杯！' },
  { id: 2, icon: '🎤', name: '学动物叫', content: '模仿三种不同动物的叫声，每种叫三声' },
  { id: 3, icon: '💃', name: '才艺表演', content: '即兴表演一段舞蹈或歌曲' },
  { id: 4, icon: '😣', name: '表情包模仿', content: '模仿一个经典表情包的表情' },
  { id: 5, icon: '📢', name: '大声朗读', content: '用最大声朗读这句话："我输了！"' },
]

const cardState = ref<'idle' | 'spinning' | 'stopped'>('idle')
const selectedPunishment = ref<Punishment | null>(null)
const cardRotation = ref(0)
let animationTimer: number | null = null

const isRevealed = computed(() => cardRotation.value >= 3690)

function handleCardClick() {
  if (cardState.value !== 'idle') return

  selectedPunishment.value = punishmentLibrary[Math.floor(Math.random() * punishmentLibrary.length)]!
  cardState.value = 'spinning'

  const totalRotation = 3780
  const duration = 5000
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    cardRotation.value = totalRotation * easeOut

    if (progress < 1) {
      animationTimer = requestAnimationFrame(animate)
    } else {
      cardRotation.value = totalRotation
      cardState.value = 'stopped'
    }
  }

  animationTimer = requestAnimationFrame(animate)
}

function redraw() {
  if (animationTimer !== null) {
    cancelAnimationFrame(animationTimer)
    animationTimer = null
  }
  cardRotation.value = 0
  selectedPunishment.value = null
  cardState.value = 'idle'
}

function completePunishment() {
  alert('惩罚已完成！')
  redraw()
}

onUnmounted(() => {
  if (animationTimer !== null) {
    cancelAnimationFrame(animationTimer)
  }
})
</script>

<template>
  <div class="punishment-view">
    <section class="card-section">
      <div class="card-container" @click="handleCardClick">
        <div class="card" :class="{ 'is-spinning': cardState === 'spinning' }"
          :style="{ transform: `rotateY(${cardRotation}deg)` }">
          <div class="card-face card-back">
            <div class="back-content">
              <span class="tap-icon">👆</span>
              <p class="tap-text">Tap to draw</p>
            </div>
          </div>

          <div class="card-face card-front">
            <div v-if="cardState === 'spinning' && !isRevealed" class="front-mystery">
              <span class="mystery-text">？？？？</span>
            </div>
            <div v-else-if="(cardState === 'spinning' && isRevealed) || cardState === 'stopped'" class="front-result">
              <span class="result-icon">{{ selectedPunishment?.icon }}</span>
              <h2 class="result-name">{{ selectedPunishment?.name }}</h2>
              <p class="result-desc">{{ selectedPunishment?.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="cardState === 'stopped'" class="action-buttons">
        <button class="btn btn-secondary" @click="redraw">再抽一次</button>
        <button class="btn btn-primary" @click="completePunishment">完成惩罚</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.punishment-view {
  padding: 16px;
}

.card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-container {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 3 / 4;
  perspective: 1000px;
  cursor: pointer;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(58, 95, 122, 0.2);
}

.card-back {
  background: linear-gradient(145deg, var(--blue-700) 0%, var(--blue-500) 100%);
  color: var(--color-text-inverse);
}

.back-content {
  text-align: center;
}

.tap-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
}

.tap-text {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 1px;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.card-front {
  background: var(--color-bg-card);
  transform: rotateY(180deg);
  flex-direction: column;
  padding: 24px;
}

.front-mystery {
  text-align: center;
}

.mystery-text {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: 8px;
}

.front-result {
  text-align: center;
  width: 100%;
}

.result-icon {
  font-size: 80px;
  display: block;
  margin-bottom: 16px;
}

.result-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.result-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  width: 100%;
  max-width: 320px;
}

.btn {
  flex: 1;
  min-height: 48px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--blue-500) 100%);
  color: var(--color-text-inverse);
  box-shadow: 0 4px 16px rgba(58, 95, 122, 0.3);
}

.btn-secondary {
  background: var(--color-bg-soft);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
</style>
