<script lang='ts' setup>
</script>

<template>
  <div class="stat-card" data-aos="fade-up" data-aos-delay="100">
    <div class="stat-icon">
      📦
    </div>
    <div class="stat-number">
      20KB
    </div>
    <div class="stat-label">
      核心包大小
    </div>
    <div class="stat-desc">
      Gzip 压缩后
    </div>
    <div class="stat-glow" />
  </div>
  <div class="stat-card" data-aos="fade-up" data-aos-delay="200">
    <div class="stat-icon">
      🔌
    </div>
    <div class="stat-number">
      10KB
    </div>
    <div class="stat-label">
      单插件大小
    </div>
    <div class="stat-desc">
      按需加载
    </div>
    <div class="stat-glow" />
  </div>
  <div class="stat-card" data-aos="fade-up" data-aos-delay="300">
    <div class="stat-icon">
      ⚡
    </div>
    <div class="stat-number">
      5ms
    </div>
    <div class="stat-label">
      初始化耗时
    </div>
    <div class="stat-desc">
      毫秒级响应
    </div>
    <div class="stat-glow" />
  </div>
  <div class="stat-card" data-aos="fade-up" data-aos-delay="400">
    <div class="stat-icon">
      🌐
    </div>
    <div class="stat-number">
      99.9%
    </div>
    <div class="stat-label">
      浏览器兼容性
    </div>
    <div class="stat-desc">
      现代浏览器
    </div>
    <div class="stat-glow" />
  </div>
</template>

<style scoped>
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
</style>
