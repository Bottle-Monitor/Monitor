<script lang='ts' setup>
</script>

<template>
  <div class="logo-3d">
    <div class="logo-face logo-front">
      <div class="logo-icon">
        🔮
      </div>
    </div>
    <div class="logo-face logo-back" />
    <div class="logo-face logo-right" />
    <div class="logo-face logo-left" />
    <div class="logo-face logo-top" />
    <div class="logo-face logo-bottom" />
  </div>
</template>

<style scoped>
.logo-3d {
  width: 220px;
  height: 220px;
  position: relative;
  transform-style: preserve-3d;
  animation: logoRotate 20s linear infinite;
}

.logo-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(10px);
}

.logo-front { transform: translateZ(110px); }
.logo-back { transform: translateZ(-110px) rotateY(180deg); }
.logo-right { transform: rotateY(90deg) translateZ(110px); }
.logo-left { transform: rotateY(-90deg) translateZ(110px); }
.logo-top { transform: rotateX(90deg) translateZ(110px); }
.logo-bottom { transform: rotateX(-90deg) translateZ(110px); }

.logo-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8));
}

@keyframes logoRotate {
  0% { transform: rotateY(0deg) rotateX(15deg); }
  100% { transform: rotateY(360deg) rotateX(15deg); }
}

@media (max-width: 480px) {
  .logo-3d {
    width: 80px;
    height: 80px;
  }

  .logo-icon {
    font-size: 2rem;
  }
}
</style>
