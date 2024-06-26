<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入歌曲名/歌手名/专辑名'
  },
  type: {
    type: String,
    default: 'text'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '40px'
  }
})
</script>

<template>
  <div class="input hidden lg:block">
    <div class="input-icon">
      <i class="iconfont icon-sousuo"></i>
    </div>
    <input
      :style="{ width: props.width, height: props.height }"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.value"
      @input="(e) => $emit('update:value', e.target.value)"
      @keyup.enter="searchSong"
    />
  </div>
</template>

<style lang="scss" scoped>
.input {
  position: relative;
  margin: 0 10px;
  --text-color: #999;
  .input-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    font-size: 20px;
    color: var(--text-color);
    transform: translateY(-50%);
  }
  input {
    width: 100%;
    height: 40px;
    // border: 1px solid #ccc;
    border-radius: 18px;
    padding: 0 20px;
    outline: none;
    border: none;
    background-color: rgba(0, 0, 0, 0.1);
    &:focus {
      background-color: rgba(0, 0, 0, 0.2);
      // 清空placeholder
      &::-webkit-input-placeholder {
        color: transparent;
      }
      &::placeholder {
        color: transparent;
      }
    }
    &::placeholder {
      font-size: 14px;
      text-align: center;
      color: var(--text-color);
    }
  }
}
</style>
