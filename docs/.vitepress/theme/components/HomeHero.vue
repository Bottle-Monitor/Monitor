<script lang='ts' setup>
import Logo from './Logo.vue'
</script>

<template>
  <div class="homehero">
    <div class="hero-container">
      <div class="container-left">
        <!-- 此处，拆了用 js 做动画 -->
        <div class="hero-text">
          <h1 class="title-main">
            Bottle Monitor
          </h1>
          <p class="title-sub">
            智能前端监控 SDK
          </p>
          <p class="title-description">
            基于插件化架构的现代化前端监控解决方案，低侵入，支持自定义插件
          </p>
        </div>
        <div class="cta-buttons">
          <a href="/guide/installation" class="vp-button primary">安装指南</a>
          <a href="/examples/" class="vp-button secondary">查看示例</a>
          <a href="https://github.com/bottle414/bottle-monitor" class="vp-button github" target="_blank">GitHub</a>
        </div>
        <div class="install">
          <p class="install-text">
            <span class="install-suffix">$</span>
            pnpm install @bottle-monitor/core
          </p>
          <button class="install-copy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-892f3042=""><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-892f3042="" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-892f3042="" /></svg>
          </button>
        </div>
      </div>
      <div class="container-right">
        <Logo />
      </div>
    </div>
  </div>
</template>

<style scoped>
.homehero {
  margin: 12% 0 20%;
  width: 100%;
}

.hero-container {
  display: flex;
  align-items: center;
}

.hero-text {
  .title-main {
    height: 100px;
    display: flex;
    align-items: center;
    font-size: 7.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #aa44ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
    letter-spacing: -0.02em;
  }

  .title-sub {
    color: #fafafa;
    margin: 20px 0;
    font-size: 3rem;
    height: 50px;
    display: flex;
    align-items: center;
    font-weight: 400;
    background:#00d4ff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .title-description {
    color: #fafafa;
    font-size: 2rem;
    line-height: 2.5rem;
  }
}

.logo-3d {
  margin-left: 150px;
}

.cta-buttons {
  display: flex;
  margin: 8% 0 5% 0;
  gap: 2%;
}

.install {
  background-color: #333;
  padding: 10px 0;
  width: 500px;
  padding: .6rem 1rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;

  .install-text {
    font-size: 1.25rem;

    .install-suffix {
      color: #00d4ff;
    }
  }

  .install-copy {
    background-color: rgba(100, 100, 100, .8);
    padding: 0 1.2rem;
    border-radius: 1rem;
    transition: background-color .3s;
  }

  .install-copy:hover {
    background-color: rgba(203, 241, 255, 0.7);
  }
}
</style>
