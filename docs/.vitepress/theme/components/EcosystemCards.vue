<script lang='ts' setup>
</script>

<template>
  <div class="ecosystem-item" data-aos="fade-right" data-aos-delay="100">
    <div class="ecosystem-icon">
      🚨
    </div>
    <h3>内置插件</h3>
    <p>错误监控、性能监控、用户行为等核心功能</p>
    <ul>
      <li>智能错误捕获</li>
      <li>Core Web Vitals</li>
      <li>用户行为追踪</li>
    </ul>
    <div class="ecosystem-glow" />
  </div>
  <div class="ecosystem-item" data-aos="fade-up" data-aos-delay="200">
    <div class="ecosystem-icon">
      🔧
    </div>
    <h3>自定义插件</h3>
    <p>支持开发自定义监控插件，满足特定业务需求</p>
    <ul>
      <li>插件开发指南</li>
      <li>生命周期管理</li>
      <li>热插拔支持</li>
    </ul>
    <div class="ecosystem-glow" />
  </div>
  <div class="ecosystem-item" data-aos="fade-left" data-aos-delay="300">
    <div class="ecosystem-icon">
      🎣
    </div>
    <h3>Hook 系统</h3>
    <p>提供丰富的数据处理钩子，支持数据脱敏、转换等操作</p>
    <ul>
      <li>数据预处理</li>
      <li>自定义转换</li>
      <li>灵活配置</li>
    </ul>
    <div class="ecosystem-glow" />
  </div>
</template>

<style scoped>
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
</style>
