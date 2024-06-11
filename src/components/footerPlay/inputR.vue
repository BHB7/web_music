<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  value: {
    type: Number,
    default: 0
  },
  style: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'thin' // thin | normal | thick
  }
})
const paceIptDom = ref()
const updateProgress = (newProgress) => {
  // 更新进度变量
  // progress.value = newProgress
  // 获取样式并设置CSS变量
  paceIptDom.value.style.setProperty('--value', `${newProgress}%`)
}
watch(
  () => props.value,
  (newValue) => {
    updateProgress(newValue)
  }
)
const emit = defineEmits(['input'])
const handleInput = (e) => {
  updateProgress(e.target.value)
  emit('input', e.target.value)
}

onMounted(() => {
  // 初始化进度
  updateProgress(props.value)
  console.log('类型:' + props.type)
  //  根据类型设置样式
  if (props.type === 'thin') {
    paceIptDom.value.style.setProperty('--u1', '#ddd')
    paceIptDom.value.style.setProperty('--u2', '#ddd')
    paceIptDom.value.style.setProperty('--bg1', '#111')
    paceIptDom.value.style.setProperty('--bg2', '#000')
    paceIptDom.value.style.setProperty('--thumbHw', '0')
    paceIptDom.value.style.setProperty('--inpuH', '5px')
  } else if (props.type === 'normal') {
    paceIptDom.value.style.setProperty('--bg1', '#fff')
    paceIptDom.value.style.setProperty('--bg2', '#fff')
    paceIptDom.value.style.setProperty('--thumbHw', '0px')
    paceIptDom.value.style.setProperty('--inpuH', '10px')
  } else if (props.type === 'thick') {
    paceIptDom.value.style.setProperty('--thumbHw', '20px')
    paceIptDom.value.style.setProperty('--inpuH', '15px')
  }
})

// 公共防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

const hover = () => {
  debounce(
    gsap.to(paceIptDom.value, {
      duration: 0.3,
      '--inpuH': props.type === 'normal' ? '15px' : '8px',
      '--thumbHw': props.type === 'normal' ? '0' : '16px'
    }),
    100
  )
}
const noHover = () => {
  debounce(
    gsap.to(paceIptDom.value, {
      duration: 0.3,
      '--inpuH': props.type === 'normal' ? '10px' : '5px',
      '--thumbHw': props.type === 'normal' ? '0' : '8px'
    }),
    100
  )
}
</script>
<template>
  <input
    ref="paceIptDom"
    type="range"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :value="props.value"
    @input="handleInput"
    :style="props.style"
    @mouseover="hover"
    @mouseout="noHover"
  />
</template>

<style lang="scss" scoped>
input[type='range'] {
  padding: 0 10px;
  --value: 0; // 进度
  --bg1: #d38383;
  --bg2: #fff;
  --u1: #575350;
  --u2: #575350;
  width: 100%; // 确保进度条宽度与包含元素相匹配
  height: 10px; // 可适当调整高度以改变触摸区域的大小
  -webkit-appearance: none; // 移除默认样式
  appearance: none;
  $inpuBack: #d38383; // 进度条槽背景
  $thumb: #000; // 滑块按钮
  --inpuH: 3px; //进度条高
  --thumbHw: 10px; // 滑块按钮宽高
  background-color: transparent;
  cursor: pointer; // 更改鼠标指针样式
  // 为了跨浏览器一致性，可能需要为不同的浏览器定义多个滑道样式
  &::-webkit-slider-runnable-track {
    height: var(--inpuH);
    background: $inpuBack; // 进度条背景色
    border-radius: var(--inpuH); // 轨道边缘圆角
  }

  &::-moz-range-track {
    height: var(--inpuH);
    background: $inpuBack;
    border-radius: var(--inpuH);
  }

  &::-ms-track {
    height: var(--inpuH);
    background: $inpuBack;
    border-radius: var(--inpuH);
  }

  // 定义输入范围的滑块（拇指）样式
  &:hover {
    transition: all 0.5s;
    &::-webkit-slider-thumb {
      opacity: 1;
    }
  }

  &::-webkit-slider-thumb {
    opacity: 0;
    -webkit-appearance: none; // 移除默认的样式
    appearance: none;
    width: var(--thumbHw); // 滑块的宽度
    height: var(--thumbHw); // 滑块的高度
    border-radius: 50%; // 滑块边缘圆角
    background-color: $thumb; // 滑块的颜色
    transition: background-color 0.2s; // 过渡动画
    border: none; // 移除滑块边框
    margin-top: calc(#{var(--thumbHw)} / -3.2); // 对滑块垂直位置进行微调
  }

  &::-moz-range-thumb {
    opacity: 0;
    width: var(--thumbHw);
    height: var(--thumbHw);
    border-radius: 50%;
    background-color: $thumb;
    transition: background-color 0.2s;
    border: none;
  }

  &::-ms-thumb {
    opacity: 0;
    width: var(--thumbHw);
    height: var(--thumbHw);
    border-radius: 50%;
    background-color: $thumb;
    transition: background-color 0.2s;
    border: none;
  }

  // 定义进度条的激活部分（已完成部分）的样式
  &::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      var(--bg1),
      var(--bg2) var(--value),
      var(--u1) var(--value),
      var(--u2) 100%
    );
    opacity: 0.5;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    background-position: calc(var(--value) * 1%);
    backdrop-filter: blur(10px);
  }
}
</style>
