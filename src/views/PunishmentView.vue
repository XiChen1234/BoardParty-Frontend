<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import type { Punishment } from '@/types/punishmentType'
import { getPublicPunishment } from '@/api/punishmentAPI'
import { toast } from '@/utils/toast'

type State = 'idle' | 'spinning' | 'stopped'
const state = ref<State>('idle')
const punishment = ref<Punishment | null>(null)
const showPunishment = ref<Punishment | null>(null)

const MIN_SPIN_TIME = 3000 // 最小旋转时间，单位毫秒
const DEFAULT_PUNISHMENT: Punishment = {
  id: 1,
  icon: '🤡',
  name: '表情包模仿',
  content: '摇一个骰子，根据骰子上的数字，翻开你的微信聊天表情包，找到第{n}个表情包，然后模仿其中的动作和表情，让全场笑到肚子疼！'
} // 默认惩罚

/**
 * 抽取公共惩罚，TODO: 后期升级为自动判断小组惩罚
 * * @returns 随机的公共惩罚
 */
async function draw() {
  if (state.value === 'spinning' || state.value === 'stopped') {
    return
  }
  state.value = 'spinning'
  const startTime = Date.now()
  startSpin()

  const spinTimer: Promise<void> = new Promise(
    (resolve) => setTimeout(resolve, MIN_SPIN_TIME)
  )
  const apiPromise = getPublicPunishment()
  // 等待API返回和旋转时间结束
  try {
    const [result] = await Promise.all([apiPromise, spinTimer])
    console.log(result)
    punishment.value = result ?? DEFAULT_PUNISHMENT
  } catch (error) {
    console.error('抽取公共惩罚失败:', error)
    toast.error('抽取失败，将使用默认惩罚')
    if (Date.now() - startTime < MIN_SPIN_TIME) {
      await spinTimer
    }
    punishment.value = DEFAULT_PUNISHMENT
  } finally {
    stopSpin()
  }
}

// 控制动画部分
const rotation = ref(0)
let rafHandle: number | null = null
let spinning = false

const SPIN_SPEED = 900
let lastTime = 0

function startSpin() {
  showPunishment.value = null
  rotation.value = 0
  spinning = true
  lastTime = performance.now()
  const spinLoop = (time: number) => {
    if (!spinning) return

    const delta = time - lastTime
    lastTime = time

    rotation.value += SPIN_SPEED * (delta / 1000)

    rafHandle = requestAnimationFrame(spinLoop)
  }

  rafHandle = requestAnimationFrame(spinLoop)
}

function stopSpin() {
  spinning = false
  const current = rotation.value
  const base = Math.floor(current / 360) * 360
  // 目标角度：再转2圈 + 停在背面180°
  const target = base + 720 + 180
  // 定义减速函数
  const deceleration = () => {
    const diff = target - rotation.value
    if (diff < 90 && !showPunishment.value) {
      showPunishment.value = punishment.value
    }
    if (diff < 0.1) {
      rotation.value = target
      state.value = 'stopped'
      rafHandle = null
      return
    }
    const step = diff * 0.01
    rotation.value += Math.max(step, 0.1)
    rafHandle = requestAnimationFrame(deceleration)
  }
  rafHandle = requestAnimationFrame(deceleration)
}

onUnmounted(() => {
  if (rafHandle) cancelAnimationFrame(rafHandle)
})

// 按钮控制
const tryAgain = () => {
  state.value = 'idle'
  showPunishment.value = null
  punishment.value = null
  rotation.value = 0
}
</script>

<template>
  <div class="page">
    <div class="card-container">
      <div class="card" @click="draw" :style="{ transform: `rotateY(${rotation}deg)` }">
        <!-- 正面 -->
        <div class="card-face card-front">
          点击抽取惩罚
        </div>
        <!-- 背面 -->
        <div class="card-face card-back">
          <div class="punishment-content" :class="{ 'is-loading': !showPunishment }">
            <template v-if="!showPunishment">
              <div class="loading-icon">🎲</div>
              <div class="loading-text">抽取中...</div>
            </template>
            <template v-else>
              <div class="icon-wrapper">
                <span class="icon">{{ showPunishment.icon }}</span>
              </div>
              <div class="info-wrapper">
                <h2 class="name">{{ showPunishment.name }}</h2>
                <p class="content">{{ showPunishment.content }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="action-list">
        <button class="btn-primary" @click="tryAgain" :disabled="state === 'idle' || state === 'spinning'">再抽一次</button>
        <button class="btn-success">完成惩罚</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
}

.card-container {
  width: 100%;
  max-width: 280px;
  height: auto;
  aspect-ratio: 260 / 360;
  perspective: 1000px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--card-radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backface-visibility: hidden;
  -webkit-tap-highlight-color: transparent;
}

.card-front {
  background: linear-gradient(135deg, var(--blue-500), var(--blue-1000));
  color: var(--color-text-inverse);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease;
}

.card-front:active {
  transform: scale(0.97);
}

.card-back {
  background: var(--card-bg);
  transform: rotateY(180deg);
  padding: 24px;
}

.punishment-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 16px;
}

.punishment-content.is-loading {
  gap: 12px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--color-bg-soft);
  border-radius: 50%;
}

.icon {
  font-size: 48px;
}

.loading-icon {
  font-size: 48px;
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.content {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  padding: 0 8px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
  max-width: 280px;
}

.action-list button {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-text-inverse);
  box-shadow: 0 4px 12px rgba(58, 95, 122, 0.3);
}

.btn-primary:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(58, 95, 122, 0.3);
}

.btn-primary:disabled {
  background: var(--button-primary-bg-disabled);
}

.btn-success {
  background: var(--color-success);
  color: var(--color-text-inverse);
  box-shadow: 0 4px 12px rgba(106, 153, 131, 0.3);
}

.btn-success:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(106, 153, 131, 0.3);
}

@media (min-width: 768px) {
  .page {
    padding: 24px;
    gap: 24px;
  }

  .card-container {
    max-width: 320px;
  }

  .card-front {
    font-size: 20px;
  }

  .icon {
    font-size: 64px;
  }

  .name {
    font-size: 22px;
  }

  .content {
    font-size: 16px;
  }

  .action-list {
    flex-direction: row;
    max-width: 400px;
    gap: 16px;
  }

  .action-list button {
    flex: 1;
    padding: 14px 20px;
    font-size: 15px;
  }

  .btn-primary:hover,
  .btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
}
</style>
