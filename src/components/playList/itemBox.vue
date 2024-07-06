<script setup>
const props = defineProps({
  item: { type: Object, required: true }
})
</script>
<template>
  <div class="item-box">
    <div class="cover-box lg:w-60 lg:mr-4 lg:h-60 h-20 w-16 mr-2">
      <img v-lazy :src="item.picUrl || '@/assets/audio.svg'" alt="" />
    </div>
    <div class="desc lg:w-48 lg:mt-4 h-16 w-20">
      <p class="title font-bold lg:text-xl text-md">{{ item.name || '加载失败..' }}</p>
      <!-- <p class="auth font-thin text-zinc-500 lg:text-lg text-sm">作者暂无</p> -->
      <div class="plays font-thin text-zinc-500 lg:text-lg text-sm">{{ item.playCount }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.item-box {
  cursor: pointer;

  display: flex;
  position: relative;
  justify-content: space-between;
  &:hover {
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      animation: op 0.5s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    @keyframes op {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
  .cover-box {
    // width: 150px;
    // height: 150px;
    border-radius: 10px;
    overflow: hidden;
    // margin-right: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .desc {
    font-family: 'my-Font';
    // border: 1px solid #000;
    // min-width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    // padding: 20px 0;
    .title {
    }
  }
}
</style>
