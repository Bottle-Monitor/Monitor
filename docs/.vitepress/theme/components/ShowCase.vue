<script lang='ts' setup>
defineProps(['title', 'suffix'])
</script>

<template>
  <div class="showcase">
    <div class="showcase-header">
      <h2 class="showcase-title">
        {{ title }}
      </h2>
    </div>
    <div class="showcase-grid">
      <slot />
    </div>
  </div>
</template>

<style scoped>
    .showcase {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(170, 68, 255, 0.02) 100%);
        backdrop-filter: blur(20px);
    }
    .showcase-title {
        position: relative;
        width: fit-content;
        left: 50%;
        background: linear-gradient(90deg, #00d4ff, #aa44ff);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .showcase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2.5rem;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }
</style>
