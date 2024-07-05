<script setup>
import { onMounted, ref } from 'vue'
import songListDetail from '@/components/songList/songListDetail.vue'
import { useWyUserStore, useViewMsgStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService, getPlaylistDetailService } from '@/api/wyy/user'
import { getSongDetailService } from '@/api/wyy/song'
import { useRoute } from 'vue-router'
import songListTabel from '@/components/songList/songListTabel.vue'
import Segmented from '@/components/Segmented.vue'
const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
const wyUserStore = useWyUserStore()
const playListId = ref('')
const route = useRoute()
console.log(wyUserStore.user.userInfo.userId)
const playList = ref()
// tag默认选中
const activeKey = ref('1')
onMounted(() => {
  viewMsgTitleStore.setCNavTitle('我喜欢的音乐')
  // 获取用户歌单
  getUserPlaylistService(wyUserStore.user.userInfo.userId).then((res) => {
    // console.log(res)
    playListId.value = res.playlist[0].id
    // 获取歌单详情
    getPlaylistDetailService(res?.playlist[0].id).then((res) => {
      console.log(res)
      playList.value = res.playlist
      let idsStr = ''
      playList.value.trackIds.forEach((item, index) => {
        idsStr += `${item.id},`
      })
      // 获取歌曲详情
      getSongDetailService(idsStr.substring(0, idsStr.lastIndexOf(','))).then((res) => {
        // console.log(res.songs)
        playList.value.songs = res.songs
      })

      // 人造一个属性 isPlay 默认为false
      playList.value.tracks.forEach((item) => {
        item.isPlay = false
        item.isLoading = false
      })
    })
  })
})
const activeIndex = ref(0)
const sel = (index) => {
  activeIndex.value = index
}
</script>
<template>
  <!-- 歌单详情组件 -->
  <songListDetail :list="playList">
    <template #content>
      <!-- 标签Tab -->
      <Segmented
        style="margin-bottom: 5px"
        :option="['歌曲', '评论']"
        :active-index="activeIndex"
        @sel="sel"
      ></Segmented>
      <div class="play-list" v-if="activeIndex === 0">
        <songListTabel :list="playList"></songListTabel>
      </div>
      <!-- <h2>我收藏的歌单</h2>
          <div class="play-list">a</div> -->
    </template>
  </songListDetail>
</template>

<style lang="scss" scoped>
.play-list {
  padding-bottom: 290px;
}
</style>
