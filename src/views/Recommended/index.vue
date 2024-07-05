<script setup>
import { useWyUserStore, useViewMsgStore } from '@/stores'
import Segmented from '@/components/Segmented.vue'
import itemBox from '@/components/playList/itemBox.vue'
import { ref } from 'vue'
const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
viewMsgTitleStore.setCNavTitle('为你推荐')

const activeIndex = ref(0)
const sel = (index) => {
  activeIndex.value = index
}
</script>

<template>
  <header class="header">
    <Segmented
      @sel="sel"
      :option="['最新', '最热1', '测试']"
      :active-index="activeIndex"
    ></Segmented>
  </header>
  <section class="body">
    <itemBox class="item" v-for="item in 20"></itemBox>
  </section>
</template>

<style lang="scss" scoped>
.header {
}
.body {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  overflow: scroll;
  height: calc(100vh - 184px);
  padding-bottom: 60px;
  .item {
    margin-right: 20px;
    margin-top: 20px;
  }
}
</style>
