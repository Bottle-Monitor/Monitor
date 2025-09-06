<script setup lang="ts">
const showcaseItems = [
  {
    id: 1,
    icon: '🔌',
    iconClass: 'icon-plugin',
    title: '插件化架构',
    description: '模块化设计，按需加载，支持自定义插件扩展',
    features: ['热插拔', '依赖注入', '生命周期管理'],
  },
  {
    id: 2,
    icon: '📡',
    iconClass: 'icon-event',
    title: '事件总线',
    description: '高性能的事件发布订阅系统，支持异步处理',
    features: ['异步队列', '事件过滤', '优先级控制'],
  },
  {
    id: 3,
    icon: '📊',
    iconClass: 'icon-data',
    title: '数据管理',
    description: '智能的数据收集、处理和上报机制',
    features: ['实时处理', '智能去重', '压缩优化'],
  },
  {
    id: 4,
    icon: '🔄',
    iconClass: 'icon-sync',
    title: '同步机制',
    description: '可靠的数据同步和错误重试策略',
    features: ['指数退避', '离线缓存', '状态同步'],
  },
]
</script>

<template>
  <div class="tech-showcase">
    <div class="showcase-header">
      <h2 class="showcase-title">
        技术架构
      </h2>
      <p class="showcase-subtitle">
        基于现代 Web 技术构建的插件化监控系统
      </p>
    </div>

    <div class="showcase-grid">
      <div v-for="item in showcaseItems" :key="item.id" class="showcase-item">
        <div class="item-icon" :class="item.iconClass">
          <span class="icon-symbol">{{ item.icon }}</span>
        </div>
        <div class="item-content">
          <h3 class="item-title">
            {{ item.title }}
          </h3>
          <p class="item-description">
            {{ item.description }}
          </p>
          <div class="item-features">
            <span v-for="feature in item.features" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="showcase-architecture">
      <h3 class="architecture-title">
        系统架构图
      </h3>
      <div class="architecture-diagram">
        <div class="diagram-layer">
          <div class="layer-label">
            应用层
          </div>
          <div class="layer-items">
            <div class="diagram-item">
              React App
            </div>
            <div class="diagram-item">
              Vue App
            </div>
            <div class="diagram-item">
              原生 JS
            </div>
          </div>
        </div>

        <div class="diagram-arrow">
          ↓
        </div>

        <div class="diagram-layer">
          <div class="layer-label">
            SDK 核心
          </div>
          <div class="layer-items">
            <div class="diagram-item">
              事件总线
            </div>
            <div class="diagram-item">
              插件系统
            </div>
            <div class="diagram-item">
              数据队列
            </div>
          </div>
        </div>

        <div class="diagram-arrow">
          ↓
        </div>

        <div class="diagram-layer">
          <div class="layer-label">
            监控插件
          </div>
          <div class="layer-items">
            <div class="diagram-item">
              错误监控
            </div>
            <div class="diagram-item">
              性能监控
            </div>
            <div class="diagram-item">
              用户行为
            </div>
          </div>
        </div>

        <div class="diagram-arrow">
          ↓
        </div>

        <div class="diagram-layer">
          <div class="layer-label">
            数据上报
          </div>
          <div class="layer-items">
            <div class="diagram-item">
              智能重试
            </div>
            <div class="diagram-item">
              离线缓存
            </div>
            <div class="diagram-item">
              批量上报
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-showcase {
  padding: 4rem 0;
  background: var(--vp-c-bg-alt);
}

.showcase-header {
  text-align: center;
  margin-bottom: 3rem;
}

.showcase-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.showcase-subtitle {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
}

.showcase-item {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 2rem;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.showcase-item:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: var(--shadow-lg);
}

.showcase-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.showcase-item:hover::before {
  transform: scaleX(1);
}

.item-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.item-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0.1;
  transition: opacity var(--transition-normal);
}

.showcase-item:hover .item-icon::before {
  opacity: 0.2;
}

.icon-symbol {
  font-size: 2.5rem;
  z-index: 1;
  position: relative;
}

.item-content {
  position: relative;
  z-index: 2;
}

.item-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.item-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.item-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  transition: all var(--transition-fast);
}

.feature-tag:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.showcase-architecture {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.architecture-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 2rem 0;
}

.architecture-diagram {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 2rem;
}

.diagram-layer {
  text-align: center;
  margin-bottom: 1rem;
}

.layer-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.layer-items {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.diagram-item {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.diagram-item:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand);
  color: white;
  transform: scale(1.05);
}

.diagram-arrow {
  text-align: center;
  font-size: 2rem;
  color: var(--vp-c-brand);
  margin: 1rem 0;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .showcase-title {
    font-size: 2rem;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .showcase-item {
    padding: 1.5rem;
  }

  .item-icon {
    width: 60px;
    height: 60px;
  }

  .icon-symbol {
    font-size: 2rem;
  }

  .architecture-diagram {
    padding: 1rem;
  }

  .layer-items {
    flex-direction: column;
    align-items: center;
  }
}
</style>
