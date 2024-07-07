<script setup>
import { useWyUserStore, useViewMsgStore } from '@/stores'
import Segmented from '@/components/Segmented.vue'
import itemBox from '@/components/playList/itemBox.vue'
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import { getRecommendSongListService } from '@/api/wyy/songList'
import router from '@/router'
import loader from '@/components/loader.vue'
import { SyncOutlined } from '@ant-design/icons-vue'

const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
viewMsgTitleStore.setCNavTitle('为你推荐')

const playList = ref([])
const isLoading = ref(true)
const songListSum = ref(12)
const activeIndex = ref(0)
const isFetching = ref(false)
const listEnd = ref(false)
const isIntersecting = ref(false)

const sel = (index) => {
  activeIndex.value = index
}

const goPlayListDetail = (id) => {
  router.push({
    path: '/playListDetail',
    query: { id }
  })
}

const footerRef = ref(null)

const removeDuplicates = (existingList, newList) => {
  const existingIds = new Set(existingList.map((item) => item.id))
  return newList.filter((item) => !existingIds.has(item.id))
}

const getMoreSongs = () => {
  if (!isIntersecting.value || isLoading.value || isFetching.value || listEnd.value) return

  isFetching.value = true
  songListSum.value += 12

  getRecommendSongListService(songListSum.value)
    .then((res) => {
      const newSongs = removeDuplicates(playList.value, res.result)
      if (newSongs.length === 0) {
        listEnd.value = true
      } else {
        playList.value = [...playList.value, ...newSongs]
      }
    })
    .catch((err) => {
      console.error('获取歌单失败', err)
    })
    .finally(() => {
      isFetching.value = false
    })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    isIntersecting.value = entries[0].isIntersecting
    if (isIntersecting.value) {
      getMoreSongs()
    }
  })

  nextTick(() => {
    if (footerRef.value) observer.observe(footerRef.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  getRecommendSongListService(songListSum.value)
    .then((res) => {
      playList.value = res.result
      isLoading.value = false
    })
    .catch((err) => {
      console.error('获取歌单失败', err)
    })
})
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
      v-if="!isLoading"
      @click="goPlayListDetail(item.id)"
      :item="item"
      class="item lg:mt-4 lg:mr-4 mt-6 mr-5 mx-2"
      v-for="item in playList"
      :key="item.id"
    ></itemBox>

    <div class="loader" v-for="item in 12" v-else>
      <div class="img lg:w-60 lg:mr-4 lg:h-60 h-20 w-16"></div>
      <div class="desc lg:w-48 lg:mt-4 h-16 w-20">
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    <a-back-top :visibilityHeight="800" />

    <div class="w-full">
      <footer class="footer" ref="footerRef" v-if="!listEnd">
        <loader></loader>
        <span>加载更多...</span>
      </footer>
      <div class="footer" v-else>
        <span>没有更多啦~</span>
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
    background-color: #cacaca;
  }
  .desc {
    display: flex;
    flex-direction: column;
    p {
      margin: 0;
      padding: 5px 20px;
      margin: 5px 0;
      border-radius: 5px;
      background-color: #cacaca;
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
}

.footer {
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
