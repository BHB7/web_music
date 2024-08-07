<script setup>
import { useWyUserStore, useViewMsgStore } from '@/stores'
import Segmented from '@/components/Segmented.vue'
import itemBox from '@/components/playList/itemBox.vue'
import { onMounted, ref, reactive, onUnmounted, nextTick } from 'vue'
import { getRecommendSongListService } from '@/api/wyy/songList'
import router from '@/router'
import loader from '@/components/loader.vue'
import { SyncOutlined } from '@ant-design/icons-vue'

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
  <var-tabs elevation v-model:active="activeIndex">
    <var-tab>最新</var-tab>
    <var-tab>选项2</var-tab>
    <var-tab>选项3</var-tab>
  </var-tabs>

  <var-tabs-items v-model:active="activeIndex">
    <var-tab-item>
      <div class="body">
        <div class="item" v-for="item in playList">
          <var-style-provider :style-vars="successTheme" :key="item.id">
            <!-- 每一个歌单 -->
            <var-card
              @click="goPlayListDetail(item.id)"
              :description="item.name.trim('')"
              :src="item.picUrl || '@/assets/audio.svg'"
            />
          </var-style-provider>
        </div>
        <var-back-top :duration="1000" :visibility-height="800" :bottom="120" />
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
    <var-tab-item>
      很多人不长眼睛，嚣张都靠武器。 赤手空拳就缩成蚂蚁。 不用麻烦了，不用麻烦了。
      不用麻烦，不用麻烦了，不用麻烦了。
    </var-tab-item>
    <var-tab-item>
      你们一起上，我在赶时间。 每天决斗观众都累了，英雄也累了。 不用麻烦了，不用麻烦了。
      副歌不长你们有几个，一起上好了。 正义呼唤我，美女需要我。 牛仔很忙的。
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
