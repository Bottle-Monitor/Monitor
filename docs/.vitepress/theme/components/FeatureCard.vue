<script setup lang="ts">
interface Props {
  highlighted?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="feature-card" :class="{ 'feature-card--highlighted': highlighted }">
    <div class="feature-icon">
      <slot name="icon">
        <span class="default-icon">🚀</span>
      </slot>
    </div>

    <div class="feature-content">
      <h3 class="feature-title">
        <slot name="title">
          特性标题
        </slot>
      </h3>

      <p class="feature-description">
        <slot name="description">
          特性描述内容
        </slot>
      </p>

      <div v-if="$slots.tags" class="feature-tags">
        <slot name="tags" />
      </div>

      <div v-if="$slots.actions" class="feature-actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="highlighted" class="feature-decoration">
      <div class="decoration-line" />
      <div class="decoration-dot" />
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  position: relative;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 2rem;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand);
  box-shadow: var(--shadow-lg);
}

.feature-card--highlighted {
  border-color: var(--vp-c-brand);
  background: linear-gradient(135deg, var(--vp-c-bg-elv) 0%, rgba(0, 212, 255, 0.05) 100%);
  box-shadow: var(--shadow-glow);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  transition: all var(--transition-normal);
}

.feature-card:hover .feature-icon {
  background: var(--vp-c-brand);
  transform: scale(1.1) rotate(5deg);
}

.default-icon {
  font-size: 2.5rem;
}

.feature-content {
  position: relative;
  z-index: 2;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.feature-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.decoration-line {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 2px;
  background: var(--gradient-primary);
  transform: rotate(45deg);
}

.decoration-dot {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 8px;
  height: 8px;
  background: var(--vp-c-brand);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .feature-card {
    padding: 1.5rem;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .feature-title {
    font-size: 1.3rem;
  }
}
</style>
