<script setup lang="ts">
import { ref, computed } from 'vue'
import { PunishmentType, getRandomPunishment, type Punishment } from '@/data/punishment'

/* ====================================
   状态定义
   ==================================== */

// 当前惩罚项
const currentPunishment = ref<Punishment | null>(null)

// 动画状态
const isFlipping = ref(false)
const showResult = ref(false)
const isCardVisible = ref(false)
const isButtonLoading = ref(false)

// 历史记录
const historyList = ref<Punishment[]>([])
const isHistoryCollapsed = ref(true)

// 粒子动画
interface Particle {
  id: number
  tx: number
  ty: number
  color: string
  size: number
  duration: number
}
const particles = ref<Particle[]>([])
let particleId = 0

// 屏幕闪烁
const showScreenFlash = ref(false)

// 是否正在抽取中
const isSpinning = computed(() => isFlipping.value)

/* ====================================
   惩罚类型映射
   ==================================== */

const typeConfig = {
  [PunishmentType.ACTION]: {
    label: '动作任务',
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-soft)',
    borderColor: 'var(--color-primary-border)'
  },
  [PunishmentType.TRUTH]: {
    label: '真心话',
    color: 'var(--color-accent)',
    bgColor: 'rgba(217, 136, 89, 0.15)',
    borderColor: 'rgba(217, 136, 89, 0.3)'
  },
  [PunishmentType.DARE]: {
    label: '大冒险',
    color: 'var(--color-danger)',
    bgColor: 'var(--color-danger-bg)',
    borderColor: 'rgba(199, 80, 71, 0.3)'
  }
}

/* ====================================
   动画函数
   ==================================== */

/**
 * 生成豪华粒子效果
 */
const generateParticles = () => {
  const colors = ['#C75047', '#D98859', '#3A5F7A', '#6A9983', '#A6C1D4', '#E85A4F']
  const newParticles: Particle[] = []

  // 生成更多粒子，形成更豪华的效果
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.3
    const distance = 150 + Math.random() * 150
    const colorIndex = Math.floor(Math.random() * colors.length)

    newParticles.push({
      id: particleId++,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      color: colors[colorIndex] ?? '#C75047',
      size: 8 + Math.random() * 10,
      duration: 1.0 + Math.random() * 0.6
    })
  }

  particles.value = newParticles
  setTimeout(() => {
    particles.value = []
  }, 2000)
}

/**
 * 屏幕闪烁效果
 */
const triggerScreenFlash = () => {
  showScreenFlash.value = true
  setTimeout(() => {
    showScreenFlash.value = false
  }, 300)
}

/**
 * 抽取惩罚
 */
const spinPunishment = async () => {
  if (isSpinning.value || isButtonLoading.value) return

  // 立即锁定按钮，不显示任何中间文字
  isButtonLoading.value = true
  isFlipping.value = true
  showResult.value = false
  isCardVisible.value = true

  // 快速切换内容制造期待感
  const quickSpins = 8
  for (let i = 0; i < quickSpins; i++) {
    currentPunishment.value = getRandomPunishment()
    await new Promise(resolve => setTimeout(resolve, 80 + i * 40))
  }

  // 获取最终惩罚
  const finalPunishment = getRandomPunishment()
  currentPunishment.value = finalPunishment

  // 翻转显示结果
  await new Promise(resolve => setTimeout(resolve, 300))
  isFlipping.value = false
  showResult.value = true
  isButtonLoading.value = false

  // 触发豪华效果
  triggerScreenFlash()
  generateParticles()

  // 添加到历史记录
  historyList.value.unshift(finalPunishment)
  if (historyList.value.length > 10) {
    historyList.value.pop()
  }
}

/**
 * 切换历史记录折叠状态
 */
const toggleHistory = () => {
  isHistoryCollapsed.value = !isHistoryCollapsed.value
}
</script>

<template>
  <div class="punishment-page">
    <!-- 屏幕闪烁效果 -->
    <div class="screen-flash" :class="{ active: showScreenFlash }"></div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="deco-circle circle-1"></div>
      <div class="deco-circle circle-2"></div>
      <div class="deco-circle circle-3"></div>
    </div>

    <!-- 标题区 -->
    <div class="punishment-header">
      <h1 class="main-title">惩罚轮盘</h1>
      <p class="subtitle">点击抽取，开启你的命运之旅</p>
    </div>

    <!-- 主抽取区域 -->
    <div class="punishment-main">
      <!-- 卡片容器 -->
      <div class="card-container">
        <!-- 粒子效果层 -->
        <div class="particles-container" v-if="particles.length > 0">
          <div v-for="p in particles" :key="p.id" class="particle" :style="{
            '--tx': p.tx + 'px',
            '--ty': p.ty + 'px',
            '--color': p.color,
            '--size': p.size + 'px',
            '--duration': p.duration + 's'
          }"></div>
        </div>

        <!-- 卡片 -->
        <div class="punishment-card" :class="{ 'is-flipped': showResult }" v-show="isCardVisible">
          <!-- 卡片边框闪光 -->
          <div class="card-border-glow" v-if="showResult"></div>

          <!-- 卡片内层（用于3D翻转） -->
          <div class="card-inner">
            <!-- 正面 -->
            <div class="card-face card-front">
              <div class="card-content front-content">
                <div class="punishment-icon">
                  <i class="iconfont icon-lucky"></i>
                </div>
                <h2 class="card-title">抽取惩罚</h2>
                <p class="card-hint">点击下方按钮开始</p>
              </div>
            </div>

            <!-- 背面 -->
            <div class="card-face card-back">
              <div class="card-content back-content" v-if="currentPunishment" :style="{
                '--type-color': typeConfig[currentPunishment.type].color,
                '--type-bg': typeConfig[currentPunishment.type].bgColor,
                '--type-border': typeConfig[currentPunishment.type].borderColor
              }">
                <!-- 类型标签 -->
                <div class="punishment-type">
                  <span class="type-badge">{{ typeConfig[currentPunishment.type].label }}</span>
                </div>

                <!-- 图标 -->
                <div class="result-icon">
                  <i class="iconfont" :class="currentPunishment.icon"></i>
                </div>

                <!-- 惩罚内容 -->
                <div class="punishment-text">
                  <p>{{ currentPunishment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 光晕效果 -->
          <div class="card-glow" v-if="showResult"></div>
        </div>

        <!-- 空状态提示 -->
        <div class="empty-state" v-if="!isCardVisible && !isSpinning">
          <div class="empty-icon">
            <i class="iconfont icon-lucky"></i>
          </div>
          <p>准备好接受惩罚了吗？</p>
        </div>
      </div>

      <!-- 抽取按钮 -->
      <button class="spin-button" :class="{ spinning: isSpinning }" :disabled="isSpinning || isButtonLoading"
        @click="spinPunishment">
        <span class="button-inner">
          <i class="iconfont icon-lucky"></i>
          <span class="button-text">开始抽取</span>
        </span>
      </button>
    </div>

    <!-- 历史记录 -->
    <div class="history-section" v-if="historyList.length > 0">
      <div class="history-header" @click="toggleHistory">
        <h3 class="history-title">
          <i class="iconfont icon-history"></i>
          最近惩罚
        </h3>
        <button class="collapse-btn" :class="{ collapsed: isHistoryCollapsed }">
          <i class="iconfont icon-arrow-down"></i>
        </button>
      </div>

      <div class="history-list-wrapper" :class="{ collapsed: isHistoryCollapsed }">
        <div class="history-list">
          <div v-for="(item, index) in historyList" :key="item.id + '-' + index" class="history-item"
            :style="{ '--delay': index * 0.05 + 's' }">
            <span class="history-type" :style="{ color: typeConfig[item.type].color }">
              {{ typeConfig[item.type].label }}
            </span>
            <span class="history-content">{{ item.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ====================================
   页面基础布局（移动端优先）
   ==================================== */
.punishment-page {
  min-height: 100dvh;
  background: var(--color-bg-page);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ====================================
   屏幕闪烁效果
   ==================================== */
.screen-flash {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  z-index: 100;
  transition: opacity 0.15s ease;
}

.screen-flash.active {
  opacity: 1;
}

/* ====================================
   背景装饰（简化移动端）
   ==================================== */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.circle-1 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, var(--color-danger-bg) 0%, transparent 70%);
  top: -30px;
  right: -30px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%);
  bottom: 30%;
  left: -20px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(217, 136, 89, 0.2) 0%, transparent 70%);
  top: 35%;
  right: 5px;
  animation: float 5s ease-in-out infinite 1s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

/* ====================================
   标题区
   ==================================== */
.punishment-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.main-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 6px 0;
  background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* ====================================
   主抽取区域
   ==================================== */
.punishment-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.card-container {
  position: relative;
  width: 240px;
  height: 320px;
  perspective: 1000px;
}

/* ====================================
   惩罚卡片
   ==================================== */
.punishment-card {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.punishment-card:hover {
  transform: translateY(-4px);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.punishment-card.is-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  background: var(--gray-0);
  border: 1px solid var(--color-border);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-front {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back {
  transform: rotateY(180deg);
  border-color: var(--type-border);
  background: var(--type-bg);
}

/* 卡片边框闪光 */
.card-border-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 18px;
  background: linear-gradient(45deg, transparent 30%, var(--color-danger) 50%, transparent 70%);
  background-size: 200% 200%;
  animation: borderShine 2s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes borderShine {
  0% {
    background-position: 100% 100%;
    opacity: 0;
  }

  50% {
    background-position: 0% 0%;
    opacity: 1;
  }

  100% {
    background-position: 100% 100%;
    opacity: 0;
  }
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 正面内容 */
.front-content {
  gap: 14px;
}

.punishment-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-danger-bg) 0%, var(--color-primary-soft) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.punishment-icon .iconfont {
  font-size: 36px;
  color: var(--color-danger);
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(199, 80, 71, 0.4);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px 10px rgba(199, 80, 71, 0);
  }
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.card-hint {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* 背面内容 */
.back-content {
  gap: 16px;
}

.punishment-type {
  width: 100%;
  display: flex;
  justify-content: center;
}

.type-badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: var(--type-color);
  background: var(--gray-0);
  border: 1px solid var(--type-border);
}

.result-icon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--gray-0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    transform: scale(0) rotate(-10deg);
    opacity: 0;
  }

  60% {
    transform: scale(1.2) rotate(5deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.result-icon .iconfont {
  font-size: 42px;
  color: var(--type-color);
}

.punishment-text {
  text-align: center;
  padding: 14px;
  background: var(--gray-0);
  border-radius: 12px;
  width: 100%;
  animation: slideUp 0.4s ease-out 0.2s both;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.punishment-text p {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.5;
}

/* 光晕效果 */
.card-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 24px;
  background: transparent;
  pointer-events: none;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0% {
    opacity: 0.4;
    box-shadow: 0 0 20px rgba(199, 80, 71, 0.3),
      0 0 40px rgba(199, 80, 71, 0.15);
  }

  50% {
    opacity: 1;
    box-shadow: 0 0 35px rgba(199, 80, 71, 0.6),
      0 0 70px rgba(199, 80, 71, 0.3),
      0 0 100px rgba(199, 80, 71, 0.15);
  }

  100% {
    opacity: 0.4;
    box-shadow: 0 0 20px rgba(199, 80, 71, 0.3),
      0 0 40px rgba(199, 80, 71, 0.15);
  }
}

/* ====================================
   粒子效果（豪华版）
   ==================================== */
.particles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  z-index: 10;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  animation: particleBurst var(--duration) cubic-bezier(0, 0.5, 0.5, 1) forwards;
  box-shadow: 0 0 6px var(--color);
}

@keyframes particleBurst {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

/* ====================================
   空状态
   ==================================== */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.empty-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: var(--color-bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon .iconfont {
  font-size: 36px;
  color: var(--color-text-tertiary);
}

.empty-state p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* ====================================
   抽取按钮（防闪现版）
   ==================================== */
.spin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 44px;
  border: none;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--color-danger) 0%, #E85A4F 100%);
  color: var(--gray-0);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(199, 80, 71, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.spin-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.spin-button:hover:not(:disabled)::before {
  left: 100%;
}

.spin-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(199, 80, 71, 0.5);
}

.spin-button:active:not(:disabled) {
  transform: scale(0.98);
}

.spin-button:disabled {
  cursor: not-allowed;
  opacity: 0.9;
}

.spin-button.spinning {
  animation: buttonPulse 0.4s ease-in-out infinite;
}

@keyframes buttonPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
}

.button-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.button-inner .iconfont {
  font-size: 18px;
}

.button-text {
  position: relative;
  z-index: 1;
}

/* ====================================
   历史记录（可折叠）
   ==================================== */
.history-section {
  width: 100%;
  max-width: 360px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  cursor: pointer;
  user-select: none;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.history-title .iconfont {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: var(--color-bg-card);
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.collapse-btn:hover {
  background: var(--color-primary);
  color: var(--gray-0);
}

.collapse-btn .iconfont {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.collapse-btn.collapsed .iconfont {
  transform: rotate(-90deg);
}

.history-list-wrapper {
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.history-list-wrapper.collapsed {
  max-height: 0;
  opacity: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--gray-0);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  animation: slideIn 0.3s ease-out;
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.history-type {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
}

.history-content {
  font-size: 13px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
