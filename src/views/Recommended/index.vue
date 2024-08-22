<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useWyUserStore, useViewMsgStore } from '@/stores'
import { getRecommendSongListService } from '@/api/wyy/songList'
import router from '@/router'
import loader from '@/components/loader.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

const state = reactive({
  score: 5,
  license: true
})

const successTheme = {
  '--card-image-width': '100%',
  '--card-image-height': '100px',
  '--card-description-margin': '2px 0',
  '--card-description-padding': '0 2px'
}

const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
viewMsgTitleStore.setCNavTitle('为你推荐')

const playList = ref([])
const isLoading = ref(true)
const songListSum = ref(121)
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
  songListSum.value += songListSum.value

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
  <var-tabs v-model:active="activeIndex">
    <var-tab>最新</var-tab>
  </var-tabs>

  <var-tabs-items v-model:active="activeIndex">
    <var-tab-item>
      <div class="body">
        <div class="item" v-for="item in playList" :key="item.id">
          <template v-if="isLoading">
            <SkeletonCard />
          </template>
          <template v-else>
            <var-style-provider :style-vars="successTheme">
              <var-card
                @click="goPlayListDetail(item.id)"
                :description="item.name.trim('')"
                :src="item.picUrl || '@/assets/audio.svg'"
              />
            </var-style-provider>
          </template>
        </div>
        <var-back-top :duration="1000" :elevation="5" :visibility-height="800" :bottom="120" />
      </div>
      <div class="w-full">
        <footer class="footer" ref="footerRef" v-if="!listEnd">
          <loader></loader>
          <span>加载更多...</span>
        </footer>
        <div class="footer" v-else>
          <span>没有更多啦~</span>
        </div>
      </div>
    </var-tab-item>
  </var-tabs-items>
</template>

<style lang="scss" scoped>
.body {
  padding-bottom: 100px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, 120px);
  justify-content: center; //这个一定要加
}
.item {
  margin: 10px 10px;
  float: left;
  width: 100px;
  &:deep(.var-card__container) {
    height: 50px;
    .var-card__description {
      font-size: 12px;
    }
  }
}
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

.header {
}

.footer {
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>