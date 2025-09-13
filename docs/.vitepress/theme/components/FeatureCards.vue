<script lang='ts' setup>

</script>

<template>
  <FeatureCard highlighted>
    <template #icon>
      <span>🚨</span>
    </template>
    <template #title>
      错误监控
    </template>
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
    <template #title>
      性能监控
    </template>
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
    <template #title>
      用户行为
    </template>
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
</template>

<style scoped>
</style>
