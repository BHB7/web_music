<script setup>
import { useWyUserStore, useViewMsgStore } from '@/stores'
import Segmented from '@/components/Segmented.vue'
import itemBox from '@/components/playList/itemBox.vue'
import { ref } from 'vue'
import { getRecommendSongListService } from '@/api/wyy/songList'
import router from '@/router'
const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
viewMsgTitleStore.setCNavTitle('为你推荐')
const playList = ref([])
getRecommendSongListService(100)
  .then((res) => {
    // console.log(res.result)
    playList.value = res.result
  })
  .catch((err) => {
    console.log(err)
    message.error('获取歌单失败')
  })
const activeIndex = ref(0)
const sel = (index) => {
  activeIndex.value = index
}

const goPlayListDetail = (id) => {
  viewMsgTitleStore.setCNavTitle('歌单详情')
  console.log(id)
  router.push({
    path: '/playListDetail',
    query: {
      id
    }
  })
}
</script>

<template>
  <header class="header">
    <Segmented
      @sel="sel"
      :option="['最新', '最热', '测试']"
      :active-index="activeIndex"
    ></Segmented>
  </header>
  <section class="body">
    <itemBox
      @click="goPlayListDetail(item.id)"
      :item="item"
      class="item lg:mt-4 lg:mr-4 mt-4 mr-4"
      v-for="item in playList"
      :key="item.id + 1"
    ></itemBox>
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
  height: calc(100vh - 170px);
  padding-bottom: 50px;
  .item {
    // margin-right: 20px;
    // margin-top: 20px;
  }
}
</style>
