<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 20
  }
})
</script>

<template>
  <div class="ld" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
    <div class="bar4"></div>
    <div class="bar5"></div>
    <div class="bar6"></div>
    <div class="bar7"></div>
    <div class="bar8"></div>
    <div class="bar9"></div>
    <div class="bar10"></div>
    <div class="bar11"></div>
    <div class="bar12"></div>
  </div>
</template>

<style scoped>
.ld {
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 10px;
}

.ld div {
  width: 8%;
  height: 24%;
  background: rgb(0, 0, 0, 0.5);
  position: absolute;
  left: 50%;
  top: 30%;
  opacity: 0;
  border-radius: 50px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  animation: fade458 1s linear infinite;
}

@keyframes fade458 {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.25;
  }
}

.ld .bar1 {
  transform: rotate(0deg) translate(0, -130%);
  animation-delay: 0s;
}

.ld .bar2 {
  transform: rotate(30deg) translate(0, -130%);
  animation-delay: -1.1s;
}

.ld .bar3 {
  transform: rotate(60deg) translate(0, -130%);
  animation-delay: -1s;
}

.ld .bar4 {
  transform: rotate(90deg) translate(0, -130%);
  animation-delay: -0.9s;
}

.ld .bar5 {
  transform: rotate(120deg) translate(0, -130%);
  animation-delay: -0.8s;
}

.ld .bar6 {
  transform: rotate(150deg) translate(0, -130%);
  animation-delay: -0.7s;
}

.ld .bar7 {
  transform: rotate(180deg) translate(0, -130%);
  animation-delay: -0.6s;
}

.ld .bar8 {
  transform: rotate(210deg) translate(0, -130%);
  animation-delay: -0.5s;
}

.ld .bar9 {
  transform: rotate(240deg) translate(0, -130%);
  animation-delay: -0.4s;
}

.ld .bar10 {
  transform: rotate(270deg) translate(0, -130%);
  animation-delay: -0.3s;
}

.ld .bar11 {
  transform: rotate(300deg) translate(0, -130%);
  animation-delay: -0.2s;
}

.ld .bar12 {
  transform: rotate(330deg) translate(0, -130%);
  animation-delay: -0.1s;
}
</style>
