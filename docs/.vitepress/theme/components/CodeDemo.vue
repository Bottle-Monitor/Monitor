<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Tab {
  key: string
  label: string
  code: string
}

interface Props {
  title: string
  tabs: Tab[]
  defaultTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: 'typescript',
})

const activeTab = ref(props.defaultTab)
const copied = ref(false)
const previewArea = ref<HTMLElement>()

const currentCode = computed(() => {
  const tab = props.tabs.find(t => t.key === activeTab.value)
  return tab?.code || ''
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(currentCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('复制失败:', err)
  }
}

function runDemo() {
  // 触发自定义事件，让父组件处理演示逻辑
  const event = new CustomEvent('run-demo', {
    detail: { tab: activeTab.value, code: currentCode.value },
  })
  previewArea.value?.dispatchEvent(event)
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<template>
  <div class="code-demo">
    <div class="demo-header">
      <h3 class="demo-title">
        {{ title }}
      </h3>
      <div class="demo-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-button" :class="[{ active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="demo-content">
      <div class="code-preview">
        <div class="preview-header">
          <span class="preview-label">预览效果</span>
          <button class="preview-button" @click="runDemo">
            <span class="button-icon">▶️</span>
            运行
          </button>
        </div>
        <div ref="previewArea" class="preview-area">
          <slot name="preview">
            <div class="default-preview">
              <div class="preview-placeholder">
                <span class="placeholder-icon">🚀</span>
                <p>点击运行按钮查看演示效果</p>
              </div>
            </div>
          </slot>
        </div>
      </div>

      <div class="code-editor">
        <div class="editor-header">
          <span class="editor-label">代码示例</span>
          <button class="copy-button" @click="copyCode">
            <span class="button-icon">{{ copied ? '✅' : '📋' }}</span>
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <div class="editor-content">
          <pre class="code-block"><code :class="`language-${activeTab}`">{{ currentCode }}</code></pre>
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="demo-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.code-demo {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  overflow: hidden;
  margin: 2rem 0;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.demo-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.tab-button.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 400px;
}

.code-preview {
  border-right: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.preview-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.preview-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preview-button:hover {
  background: var(--vp-c-brand-light);
  transform: translateY(-1px);
}

.button-icon {
  font-size: 0.8rem;
}

.preview-area {
  padding: 2rem;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-preview {
  text-align: center;
  color: var(--vp-c-text-2);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.preview-placeholder p {
  margin: 0;
  font-size: 1rem;
}

.code-editor {
  background: var(--vp-c-bg);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.editor-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.editor-content {
  padding: 1.5rem;
  max-height: 400px;
  overflow: auto;
}

.code-block {
  margin: 0;
  background: transparent;
  border: none;
  padding: 0;
}

.code-block code {
  font-family: var(--font-family-mono);
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

@media (max-width: 768px) {
  .demo-content {
    grid-template-columns: 1fr;
  }

  .code-preview {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-border);
  }

  .demo-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .demo-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .preview-area {
    padding: 1rem;
    min-height: 200px;
  }

  .editor-content {
    padding: 1rem;
  }
}
</style>
