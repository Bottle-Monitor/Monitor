---
layout: home
---

<HomeHero />

## 🎯 核心特性

<div class="features-showcase">
  <div class="features-grid">
    <FeatureCard highlighted>
      <template #icon>
        <span>🚨</span>
      </template>
      <template #title>错误监控</template>
      <template #description>
        智能捕获 JavaScript 运行时错误、Promise 未捕获错误、资源加载错误、网络请求错误等，支持白屏检测和自定义错误上报。
      </template>
      <template #tags>
        <span class="vp-badge success">自动捕获</span>
        <span class="vp-badge">智能去重</span>
        <span class="vp-badge">白屏检测</span>
      </template>
      <template #actions>
        <a href="/plugins/error" class="vp-button secondary">了解更多</a>
      </template>
    </FeatureCard>
    <FeatureCard>
      <template #icon>
        <span>📊</span>
      </template>
      <template #title>性能监控</template>
      <template #description>
        全面监控 Core Web Vitals 指标，包括 FCP、LCP、CLS、FID、INP、TTFB，支持自定义性能指标和实时性能分析。
      </template>
      <template #tags>
        <span class="vp-badge success">Core Web Vitals</span>
        <span class="vp-badge">自定义指标</span>
        <span class="vp-badge">实时分析</span>
      </template>
      <template #actions>
        <a href="/plugins/performance" class="vp-button secondary">了解更多</a>
      </template>
    </FeatureCard>
    <FeatureCard>
      <template #icon>
        <span>👤</span>
      </template>
      <template #title>用户行为</template>
      <template #description>
        追踪用户点击、页面访问、路由变化、网络请求等行为，支持 XPath/CSS 选择器定位，提供完整的用户行为分析。
      </template>
      <template #tags>
        <span class="vp-badge success">行为追踪</span>
        <span class="vp-badge">智能定位</span>
        <span class="vp-badge">数据分析</span>
      </template>
      <template #actions>
        <a href="/plugins/user" class="vp-button secondary">了解更多</a>
      </template>
    </FeatureCard>
  </div>
</div>

## 🏗️ 技术架构

<TechShowcase />

## 📈 性能指标

<div class="stats-showcase">
  <div class="stats-grid">
    <div class="stat-card" data-aos="fade-up" data-aos-delay="100">
      <div class="stat-icon">📦</div>
      <div class="stat-number">20KB</div>
      <div class="stat-label">核心包大小</div>
      <div class="stat-desc">Gzip 压缩后</div>
      <div class="stat-glow"></div>
    </div>
    <div class="stat-card" data-aos="fade-up" data-aos-delay="200">
      <div class="stat-icon">🔌</div>
      <div class="stat-number">10KB</div>
      <div class="stat-label">单插件大小</div>
      <div class="stat-desc">按需加载</div>
      <div class="stat-glow"></div>
    </div>
    <div class="stat-card" data-aos="fade-up" data-aos-delay="300">
      <div class="stat-icon">⚡</div>
      <div class="stat-number">5ms</div>
      <div class="stat-label">初始化耗时</div>
      <div class="stat-desc">毫秒级响应</div>
      <div class="stat-glow"></div>
    </div>
    <div class="stat-card" data-aos="fade-up" data-aos-delay="400">
      <div class="stat-icon">🌐</div>
      <div class="stat-number">99.9%</div>
      <div class="stat-label">浏览器兼容性</div>
      <div class="stat-desc">现代浏览器</div>
      <div class="stat-glow"></div>
    </div>
  </div>
</div>

## 🔌 插件生态

<div class="ecosystem-showcase">
  <div class="ecosystem-header">
    <h2>强大的插件生态系统</h2>
    <p>模块化设计，按需加载，支持自定义扩展</p>
  </div>

  <div class="ecosystem-grid">
    <div class="ecosystem-item" data-aos="fade-right" data-aos-delay="100">
      <div class="ecosystem-icon">🚨</div>
      <h3>内置插件</h3>
      <p>错误监控、性能监控、用户行为等核心功能</p>
      <ul>
        <li>智能错误捕获</li>
        <li>Core Web Vitals</li>
        <li>用户行为追踪</li>
      </ul>
      <div class="ecosystem-glow"></div>
    </div>
    <div class="ecosystem-item" data-aos="fade-up" data-aos-delay="200">
      <div class="ecosystem-icon">🔧</div>
      <h3>自定义插件</h3>
      <p>支持开发自定义监控插件，满足特定业务需求</p>
      <ul>
        <li>插件开发指南</li>
        <li>生命周期管理</li>
        <li>热插拔支持</li>
      </ul>
      <div class="ecosystem-glow"></div>
    </div>
    <div class="ecosystem-item" data-aos="fade-left" data-aos-delay="300">
      <div class="ecosystem-icon">🎣</div>
      <h3>Hook 系统</h3>
      <p>提供丰富的数据处理钩子，支持数据脱敏、转换等操作</p>
      <ul>
        <li>数据预处理</li>
        <li>自定义转换</li>
        <li>灵活配置</li>
      </ul>
      <div class="ecosystem-glow"></div>
    </div>
  </div>
</div>

## 🚀 开始使用

<div class="cta-showcase">
  <div class="cta-content">
    <h2>立即开始使用 Bottle Monitor</h2>
    <p>加入数千名开发者的选择，提升您的应用监控能力</p>
    <div class="cta-buttons">
      <a href="/guide/installation" class="vp-button primary">安装指南</a>
      <a href="/examples/" class="vp-button secondary">查看示例</a>
      <a href="https://github.com/bottle414/bottle-monitor" class="vp-button github" target="_blank">GitHub</a>
    </div>
  </div>

  <div class="cta-visual">
    <div class="floating-elements">
      <div class="element element-1">🔮</div>
      <div class="element element-2">⚡</div>
      <div class="element element-3">🚀</div>
      <div class="element element-4">💎</div>
    </div>
  </div>
</div>

<style scoped>
/* 全局容器样式 - 确保全宽度铺满 */
.features-showcase,
.stats-showcase,
.ecosystem-showcase,
.cta-showcase {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 4rem 0;
  position: relative;
}

/* 特性展示区域 */
.features-showcase {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(170, 68, 255, 0.02) 100%);
  backdrop-filter: blur(20px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 统计展示区域 */
.stats-showcase {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(0, 153, 204, 0.03) 100%);
  backdrop-filter: blur(20px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stat-card {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.stat-card:hover {
  border-color: rgba(0, 212, 255, 0.6);
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 25px 50px rgba(0, 212, 255, 0.15),
    0 0 0 1px rgba(0, 212, 255, 0.1);
}

.stat-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: block;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00d4ff 0%, #aa44ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.8rem;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}

.stat-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.8rem;
}

.stat-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  opacity: 0.8;
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

/* 生态系统展示区域 */
.ecosystem-showcase {
  background: linear-gradient(135deg, rgba(170, 68, 255, 0.02) 0%, rgba(0, 212, 255, 0.02) 100%);
  backdrop-filter: blur(20px);
}

.ecosystem-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
}

.ecosystem-header h2 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff 0%, #aa44ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
}

.ecosystem-header p {
  font-size: 1.3rem;
  color: var(--vp-c-text-2);
  margin: 0;
  opacity: 0.9;
}

.ecosystem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.ecosystem-item {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.ecosystem-item:hover {
  border-color: rgba(0, 212, 255, 0.6);
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 25px 50px rgba(0, 212, 255, 0.15),
    0 0 0 1px rgba(0, 212, 255, 0.1);
}

.ecosystem-icon {
  font-size: 3.5rem;
  margin-bottom: 2rem;
  display: block;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
}

.ecosystem-item h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1.2rem 0;
}

.ecosystem-item p {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.ecosystem-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.ecosystem-item li {
  padding: 0.8rem 0;
  color: var(--vp-c-text-2);
  position: relative;
  padding-left: 2rem;
  opacity: 0.9;
}

.ecosystem-item li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
  font-size: 1.1rem;
}

.ecosystem-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.ecosystem-item:hover .ecosystem-glow {
  opacity: 1;
}

/* CTA 展示区域 */
.cta-showcase {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(170, 68, 255, 0.03) 100%);
  backdrop-filter: blur(20px);
}

.cta-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cta-content h2 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff 0%, #aa44ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
}

.cta-content p {
  font-size: 1.3rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2.5rem 0;
  line-height: 1.7;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  font-size: 2.5rem;
  animation: float 8s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
}

.element-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 30%;
  animation-delay: 2s;
}

.element-3 {
  bottom: 30%;
  left: 40%;
  animation-delay: 4s;
}

.element-4 {
  top: 40%;
  right: 20%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-30px) rotate(15deg) scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .features-grid,
  .stats-grid,
  .ecosystem-grid {
    max-width: 1000px;
  }

  .cta-showcase {
    max-width: 1000px;
  }
}

@media (max-width: 768px) {
  .features-showcase,
  .stats-showcase,
  .ecosystem-showcase,
  .cta-showcase {
    padding: 3rem 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1.5rem;
  }

  .ecosystem-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1.5rem;
  }

  .ecosystem-header {
    padding: 0 1.5rem;
  }

  .ecosystem-header h2 {
    font-size: 2.5rem;
  }

  .cta-showcase {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 0 1.5rem;
  }

  .cta-content h2 {
    font-size: 2.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stat-card,
  .ecosystem-item {
    padding: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .ecosystem-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .features-grid,
  .stats-grid,
  .ecosystem-grid {
    padding: 0 1rem;
  }

  .ecosystem-header,
  .cta-showcase {
    padding: 0 1rem;
  }

  .ecosystem-header h2 {
    font-size: 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .stat-card,
  .ecosystem-item {
    padding: 1.5rem;
  }

  .stat-icon,
  .ecosystem-icon {
    font-size: 2.5rem;
  }
}
</style>
