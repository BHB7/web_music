<script setup>
const props = defineProps({
  option: {
    type: Array,
    default: () => ['最新', '最热']
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['sel'])

const sel = (index) => {
  console.log(index)
  emit('sel', index)
}
</script>
<template>
  <div class="main">
    <label
      v-for="(item, index) in props.option"
      :key="index"
      @click="sel(index)"
      :class="{ active: props.activeIndex === index }"
    >
      <input type="radio" />
      <div class="title">{{ item }}</div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.main {
  display: flex;
  label {
    font-family: 'myFont';
    font-size: 1rem;
    display: block;
    position: relative;
    --w: 50px;
    width: var(--w);
    color: rgba(0, 0, 0, 0.88);

    input {
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .active {
    animation: ac 0.3 forwards;
    &::before {
      content: '';
      width: calc(var(--w) - 10px);
      height: 2px;
      position: absolute;
      bottom: -4px;
      left: 50%;
      border-radius: 0.5rem;
      transform: translateX(-50%);
      background-color: dodgerblue;
      animation: line 0.5s forwards;
    }
  }

  @keyframes ac {
    to {
      color: dodgerblue;
    }
  }
  @keyframes line {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: calc(var(--w) - 10px);
      opacity: 1;
    }
  }
}
</style>
