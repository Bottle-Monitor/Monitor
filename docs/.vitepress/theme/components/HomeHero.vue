<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// 响应式引用
const heroSection = ref<HTMLElement>()
const heroContent = ref<HTMLElement>()
const heroHeader = ref<HTMLElement>()
const heroFeatures = ref<HTMLElement>()
const heroActions = ref<HTMLElement>()
const heroStats = ref<HTMLElement>()
const scrollIndicator = ref<HTMLElement>()

// 特性数据
const features = [
  {
    icon: '🚨',
    title: '错误监控',
    desc: '智能捕获各类错误，提供完整堆栈信息',
  },
  {
    icon: '📊',
    title: '性能监控',
    desc: 'Core Web Vitals + 自定义性能指标',
  },
  {
    icon: '👤',
    title: '用户行为',
    desc: '完整的用户交互追踪与分析',
  },
  {
    icon: '🔧',
    title: '插件化架构',
    desc: '模块化设计，支持自定义扩展',
  },
]

// 统计数据
const stats = [
  { value: '20KB', label: '核心包大小', desc: 'Gzip 压缩后' },
  { value: '10KB', label: '单插件大小', desc: '按需加载' },
  { value: '5ms', label: '初始化耗时', desc: '毫秒级响应' },
  { value: '99.9%', label: '浏览器兼容性', desc: '现代浏览器' },
]

// 粒子样式生成
function getParticleStyle(index: number) {
  const delay = Math.random() * 20
  const duration = 10 + Math.random() * 20
  const size = 2 + Math.random() * 4
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    'left': `${Math.random() * 100}%`,
    'top': `${Math.random() * 100}%`,
  }
}

// 滚动动画处理
let scrollHandler: (() => void) | null = null

onMounted(() => {
  // 初始化动画
  initAnimations()

  // 设置滚动监听
  scrollHandler = () => handleScroll()
  window.addEventListener('scroll', scrollHandler)

  // 启动粒子动画
  startParticleAnimation()
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})

// 初始化动画
function initAnimations() {
  // 标题逐行显示动画
  const titleLines = heroHeader.value?.querySelectorAll('.title-line')
  titleLines?.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add('animate-in')
    }, index * 200)
  })

  // 特性项动画
  const featureItems = heroFeatures.value?.querySelectorAll('.feature-item')
  featureItems?.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate-in')
    }, 800 + index * 200)
  })

  // 按钮动画
  const buttons = heroActions.value?.querySelectorAll('.cta-button')
  buttons?.forEach((button, index) => {
    setTimeout(() => {
      button.classList.add('animate-in')
    }, 1600 + index * 150)
  })

  // 统计项动画
  const statItems = heroStats.value?.querySelectorAll('.stat-item')
  statItems?.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate-in')
    }, 2000 + index * 200)
  })
}

// 滚动处理
function handleScroll() {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  // 视差滚动效果
  if (heroSection.value) {
    const background = heroSection.value.querySelector('.hero-background') as HTMLElement
    if (background) {
      background.style.transform = `translateY(${scrollY * 0.5}px)`
    }
  }

  // 滚动指示器动画
  if (scrollIndicator.value) {
    const opacity = Math.max(0, 1 - scrollY / windowHeight)
    scrollIndicator.value.style.opacity = opacity.toString()
  }
}

// 粒子动画
function startParticleAnimation() {
  const particles = document.querySelectorAll('.particle')
  particles.forEach((particle, index) => {
    const delay = Math.random() * 20
    setTimeout(() => {
      particle.classList.add('animate')
    }, delay * 1000)
  })
}
</script>

<template>
  <div ref="heroSection" class="hero-section">
    <!-- 动态背景层 -->
    <div class="hero-background">
      <!-- 渐变网格 -->
      <div class="gradient-grid" />

      <!-- 浮动几何图形 -->
      <div class="floating-shapes">
        <div class="shape shape-1" />
        <div class="shape shape-2" />
        <div class="shape shape-3" />
        <div class="shape shape-4" />
        <div class="shape shape-5" />
      </div>

      <!-- 粒子系统 -->
      <div class="particle-system">
        <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)" />
      </div>

      <!-- 光效层 -->
      <div class="light-effects">
        <div class="light-beam light-beam-1" />
        <div class="light-beam light-beam-2" />
        <div class="light-orb light-orb-1" />
        <div class="light-orb light-orb-2" />
      </div>
    </div>

    <!-- 主要内容层 -->
    <div ref="heroContent" class="hero-content">
      <!-- Logo 和标题区域 -->
      <div ref="heroHeader" class="hero-header">
        <div class="logo-container">
          <div class="logo-3d">
            <div class="logo-face logo-front">
              <div class="logo-icon">
                🔮
              </div>
            </div>
            <div class="logo-face logo-back" />
            <div class="logo-face logo-right" />
            <div class="logo-face logo-left" />
            <div class="logo-face logo-top" />
            <div class="logo-face logo-bottom" />
          </div>
        </div>

        <h1 class="hero-title">
          <span class="title-line title-main">Bottle Monitor</span>
          <span class="title-line title-sub">智能前端监控 SDK</span>
          <span class="title-line title-desc">基于插件化架构的现代化前端监控解决方案</span>
        </h1>

        <div class="hero-tagline">
          <span class="tagline-text">功能强大 · 类型安全 · 性能卓越</span>
        </div>
      </div>

      <!-- 特性展示区域 -->
      <div ref="heroFeatures" class="hero-features">
        <div class="feature-grid">
          <div v-for="(feature, index) in features" :key="index" class="feature-item" :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="feature-icon">
              {{ feature.icon }}
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                {{ feature.title }}
              </h3>
              <p class="feature-desc">
                {{ feature.desc }}
              </p>
            </div>
            <div class="feature-glow" />
          </div>
        </div>
      </div>

      <!-- 行动按钮区域 -->
      <div ref="heroActions" class="hero-actions">
        <div class="action-buttons">
          <a href="/guide/" class="cta-button primary">
            <span class="button-content">
              <span class="button-icon">🚀</span>
              <span class="button-text">快速开始</span>
            </span>
            <div class="button-glow" />
          </a>

          <a href="/examples/" class="cta-button secondary">
            <span class="button-content">
              <span class="button-icon">📖</span>
              <span class="button-text">查看示例</span>
            </span>
          </a>

          <a href="https://github.com/bottle414/bottle-monitor" class="cta-button github" target="_blank">
            <span class="button-content">
              <span class="button-icon">⭐</span>
              <span class="button-text">GitHub</span>
            </span>
          </a>
        </div>
      </div>

      <!-- 统计信息区域 -->
      <div ref="heroStats" class="hero-stats">
        <div class="stats-container">
          <div v-for="(stat, index) in stats" :key="index" class="stat-item" :style="{ animationDelay: `${index * 0.3}s` }">
            <div class="stat-number" :data-value="stat.value">
              {{ stat.value }}
            </div>
            <div class="stat-label">
              {{ stat.label }}
            </div>
            <div class="stat-desc">
              {{ stat.desc }}
            </div>
            <div class="stat-glow" />
          </div>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div ref="scrollIndicator" class="scroll-indicator">
        <div class="scroll-text">
          向下滚动探索更多
        </div>
        <div class="scroll-arrow">
          <div class="arrow-line" />
          <div class="arrow-line" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
}

/* 动态背景层 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 30s linear infinite;
  opacity: 0.3;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

/* 浮动几何图形 */
.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  border-color: rgba(0, 212, 255, 0.4);
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 5s;
  border-color: rgba(170, 68, 255, 0.4);
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 20%;
  animation-delay: 10s;
  border-color: rgba(0, 255, 136, 0.4);
}

.shape-4 {
  width: 40px;
  height: 40px;
  top: 40%;
  right: 30%;
  animation-delay: 15s;
  border-color: rgba(255, 170, 0, 0.4);
}

.shape-5 {
  width: 120px;
  height: 120px;
  bottom: 20%;
  right: 10%;
  animation-delay: 20s;
  border-color: rgba(255, 68, 68, 0.4);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.6;
  }
}

/* 粒子系统 */
.particle-system {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-100px) scale(1);
    opacity: 0.8;
  }
}

/* 光效层 */
.light-effects {
  position: absolute;
  width: 100%;
  height: 100%;
}

.light-beam {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
  height: 2px;
  width: 100%;
  opacity: 0.3;
}

.light-beam-1 {
  top: 25%;
  animation: scanLine 12s ease-in-out infinite;
}

.light-beam-2 {
  top: 75%;
  animation: scanLine 12s ease-in-out infinite 6s;
}

@keyframes scanLine {
  0%, 100% {
    opacity: 0.1;
    transform: scaleX(0.3);
  }
  50% {
    opacity: 0.6;
    transform: scaleX(1);
  }
}

.light-orb {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  animation: orbPulse 8s ease-in-out infinite;
}

.light-orb-1 {
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.light-orb-2 {
  bottom: -100px;
  right: -100px;
  animation-delay: 4s;
}

@keyframes orbPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
}

/* 主要内容层 */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1400px;
  padding: 0 2rem;
  width: 100%;
}

/* Logo 和标题区域 */
.hero-header {
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 1s ease-out forwards;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.logo-3d {
  width: 120px;
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  animation: logoRotate 20s linear infinite;
}

.logo-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(10px);
}

.logo-front { transform: translateZ(60px); }
.logo-back { transform: translateZ(-60px) rotateY(180deg); }
.logo-right { transform: rotateY(90deg) translateZ(60px); }
.logo-left { transform: rotateY(-90deg) translateZ(60px); }
.logo-top { transform: rotateX(90deg) translateZ(60px); }
.logo-bottom { transform: rotateX(-90deg) translateZ(60px); }

.logo-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8));
}

@keyframes logoRotate {
  0% { transform: rotateY(0deg) rotateX(15deg); }
  100% { transform: rotateY(360deg) rotateX(15deg); }
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.title-line {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.title-line.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.title-main {
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #aa44ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
  letter-spacing: -0.02em;
}

.title-sub {
  font-size: 2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-desc {
  font-size: 1.3rem;
  color: var(--vp-c-text-2);
  font-weight: 400;
  max-width: 800px;
  line-height: 1.6;
}

.hero-tagline {
  margin-bottom: 3rem;
}

.tagline-text {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
}

/* 特性展示区域 */
.hero-features {
  margin-bottom: 4rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

.feature-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-item:hover {
  border-color: rgba(0, 212, 255, 0.6);
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.feature-desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.feature-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-item:hover .feature-glow {
  opacity: 1;
}

/* 行动按钮区域 */
.hero-actions {
  margin-bottom: 4rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
}

.cta-button.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-button.primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.4);
}

.cta-button.secondary {
  background: rgba(26, 26, 26, 0.8);
  color: var(--vp-c-text-1);
  border: 2px solid rgba(0, 212, 255, 0.3);
  backdrop-filter: blur(20px);
}

.cta-button.secondary:hover {
  border-color: rgba(0, 212, 255, 0.6);
  background: rgba(26, 26, 26, 0.9);
  transform: translateY(-5px);
}

.cta-button.github {
  background: rgba(26, 26, 26, 0.8);
  color: var(--vp-c-text-1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
}

.cta-button.github:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(26, 26, 26, 0.9);
  transform: translateY(-5px);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

.button-icon {
  font-size: 1.2rem;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-button:hover .button-glow {
  opacity: 1;
}

/* 统计信息区域 */
.hero-stats {
  margin-bottom: 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

.stat-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-item:hover {
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 212, 255, 0.2);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--vp-c-brand);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.stat-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-item:hover .stat-glow {
  opacity: 1;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.scroll-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.arrow-line {
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-brand));
  animation: arrowBounce 2s ease-in-out infinite;
}

.arrow-line:nth-child(2) {
  animation-delay: 0.3s;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: scaleY(1);
    opacity: 1;
  }
  50% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
}

/* 动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    padding: 0 1rem;
  }

  .title-main {
    font-size: 3rem;
  }

  .title-sub {
    font-size: 1.5rem;
  }

  .title-desc {
    font-size: 1.1rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .stat-item {
    padding: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .logo-3d {
    width: 80px;
    height: 80px;
  }

  .logo-icon {
    font-size: 2rem;
  }
}
</style>
