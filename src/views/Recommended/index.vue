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
const isLoading = ref(true)
getRecommendSongListService(100)
  .then((res) => {
    // console.log(res.result)
    playList.value = res.result
    isLoading.value = false
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
  // viewMsgTitleStore.setCNavTitle('歌单详情')
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
      class="item lg:mt-4 lg:mr-4 mt-6 mr-5 mx-2"
      v-for="item in playList"
      :key="item.id + 1"
      v-if="!isLoading"
    ></itemBox>
    <div class="loader" v-for="item in 100" v-else>
      <div class="img lg:w-60 lg:mr-4 lg:h-60 h-20 w-16"></div>
      <div class="desc lg:w-48 lg:mt-4 h-16 w-20">
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: baseline;
  position: relative;
  background-color: #e3e3e3;
  margin: 10px 10px;
  overflow: hidden;
  .img {
    border-radius: 5px;
    margin-right: 6px;
    background-color: rgba(202, 202, 202, 0.2);
  }
  .desc {
    display: flex;
    flex-direction: column;
    p {
      margin: 0;
      padding: 5px 20px;
      margin: 5px 0;
      border-radius: 5px;
      background-color: rgba(202, 202, 202, 0.2);
    }
  }
}

.loader:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    110deg,
    rgba(227, 227, 227, 0) 0%,
    rgba(227, 227, 227, 0) 40%,
    rgba(227, 227, 227, 0.5) 50%,
    rgba(227, 227, 227, 0) 60%,
    rgba(227, 227, 227, 0) 100%
  );
  animation: gradient-animation_2 1.2s linear infinite;
}

@keyframes gradient-animation_2 {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
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
