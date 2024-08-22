<template>
  <var-card
    :style="cardStyle"
    :description="skeletonDescription"
    :src="skeletonImage"
  >
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-description"></div>
    </div>
  </var-card>
</template>

<script setup>
const skeletonDescription = '加载中...'
const skeletonImage = '@/assets/audio.svg' // 或者使用灰色占位图

const cardStyle = {
  width: '100px',
  height: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e3e3e3'
}
</script>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skeleton-image {
  width: 100%;
  height: 50px;
  background-color: #cacaca;
  margin-bottom: 10px;
}

.skeleton-description {
  width: 80%;
  height: 10px;
  background-color: #cacaca;
}
</style>