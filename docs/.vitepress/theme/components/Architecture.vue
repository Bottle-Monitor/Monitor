<script lang='ts' setup>
</script>

<template>
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
</template>

<style scoped>
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
    background: linear-gradient(90deg, #00d4ff, #aa44ff);
    background-clip: text;
    -webkit-text-fill-color: transparent;
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

    0%,
    20%,
    50%,
    80%,
    100% {
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
    .architecture-diagram {
        padding: 1rem;
    }

    .layer-items {
        flex-direction: column;
        align-items: center;
    }
}
</style>
