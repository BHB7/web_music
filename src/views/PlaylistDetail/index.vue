<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import songListDetail from '@/components/songList/songListDetail.vue'
import { useWyUserStore, useViewMsgStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService, getPlaylistDetailService } from '@/api/wyy/user'
import { getSongDetailService } from '@/api/wyy/song'
import { useRoute } from 'vue-router'
import songListTabel from '@/components/songList/songListTabel.vue'
import Segmented from '@/components/Segmented.vue'
const wyUserStore = useWyUserStore()
const viewMsgStore = useViewMsgStore() // 全局视图信息
viewMsgStore.setCNavTitle('歌单详情')
const playListId = ref('')
const route = useRoute()
console.log(wyUserStore.user.userInfo.userId)
const playList = ref()
onMounted(() => {
  console.log('进入歌单详情页')
  // 进入歌单详情 设置加载状态true
  viewMsgStore.setPlayListDetailIsLoaded(true)
  // 获取歌单详情
  getPlaylistDetailService(route.query.id).then((res) => {
    console.log(res)
    playList.value = res.playlist
    let idsStr = ''
    playList.value.trackIds.forEach((item, index) => {
      idsStr += `${item.id},`
    })
    // 获取歌曲详情
    getSongDetailService(idsStr.substring(0, idsStr.lastIndexOf(','))).then((res) => {
      // console.log(res.songs)
      viewMsgStore.setPlayListDetailIsLoaded(false) // 设置歌单详情加载状态
      playList.value.songs = res.songs
    })

    // 人造一个属性 isPlay 默认为false
    playList.value.tracks.forEach((item) => {
      item.isPlay = false
    })
  })
})

const activeIndex = ref(0)

const sel = (index) => {
  activeIndex.value = index
}
</script>
<template>
  <songListDetail :list="playList" :art="1">
    <template #content="{ list }">
      <!-- 标签Tab -->
      <Segmented
        style="margin-bottom: 5px"
        :option="['歌曲', '评论']"
        :active-index="activeIndex"
        @sel="sel"
      ></Segmented>
      <div class="play-list">
        <songListTabel :list="list"></songListTabel>
      </div>
      <!-- <h2>我收藏的歌单</h2>
          <div class="play-list">a</div> -->
    </template>
  </songListDetail>
</template>
