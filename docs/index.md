---
layout: home
---

<HomeHero />

<ShowCase title="核心特性">
  <FeatureCards/>
</ShowCase>

<ShowCase title="技术架构">
  <TechCards/>
</ShowCase>

<Architecture/>

<ShowCase title="性能指标">
  <StatsCards/>
</ShowCase>

<div class="ecosystem-showcase">
  <div class="ecosystem-header">
    <h2>强大的插件生态系统</h2>
    <p>模块化设计，按需加载，支持自定义扩展</p>
  </div>
  <ShowCase>
    <EcosystemCards/>
  </ShowCase>
</div>

## 🚀 开始使用

<div class="cta-showcase">
  <div class="cta-content">
    <h2>立即开始使用 Bottle Monitor</h2>
    <p>加入数千名开发者的选择，提升您的应用监控能力</p>
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
  width: 100%;
  padding: 4rem 0;
  position: relative;
}

/* 生态展示区域 */
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

  .ecosystem-item {
    padding: 1.5rem;
  }

  .stat-icon,
  .ecosystem-icon {
    font-size: 2.5rem;
  }
}
</style>
