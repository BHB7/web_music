<script setup>
import { onMounted, ref } from 'vue'
import songListDetail from '@/components/songList/songListDetail.vue'
import { useWyUserStore, useViewMsgStore } from '@/stores'
import { getUserPlaylistService, getPlaylistDetailService } from '@/api/wyy/user'
import { getSongDetailService } from '@/api/wyy/song'
import { useRoute } from 'vue-router'
import songListTabel from '@/components/songList/songListTabel.vue'
import Segmented from '@/components/Segmented.vue'

const wyUserStore = useWyUserStore()
const playListId = ref('')
const route = useRoute()
const playList = ref()
const activeIndex = ref(0)

console.log(wyUserStore.user.userInfo.userId)

onMounted(() => {
  const viewMsgStore = useViewMsgStore() // 全局视图信息
  viewMsgStore.setCNavTitle('我喜欢的音乐')

  // 获取用户歌单
  getUserPlaylistService(wyUserStore.user.userInfo.userId).then((res) => {
    playListId.value = res.playlist[0].id

    // 获取歌单详情
    getPlaylistDetailService(res?.playlist[0].id).then((res) => {
      playList.value = res.playlist
      let idsStr = ''
      playList.value.trackIds.forEach((item) => {
        idsStr += `${item.id},`
      })

      // 获取歌曲详情
      getSongDetailService(idsStr.substring(0, idsStr.lastIndexOf(','))).then((res) => {
        playList.value.songs = res.songs

        // 调用方法设置加载状态
        viewMsgStore.setLikePlayListIsLoaded(false)
      })

      // 人造一个属性 isPlay 默认为false
      playList.value.tracks.forEach((item) => {
        item.isPlay = false
        item.isLoading = false
      })
    })
  })
})

const sel = (index) => {
  activeIndex.value = index
}
</script>

<template>
  <songListDetail :list="playList" :art="0">
    <template #content>
      <Segmented
        style="margin-bottom: 5px"
        :option="['歌曲', '评论']"
        :active-index="activeIndex"
        @sel="sel"
      ></Segmented>
      <div class="play-list" v-if="activeIndex === 0">
        <songListTabel :list="playList" :art="0"></songListTabel>
      </div>
    </template>
  </songListDetail>
</template>

<style lang="scss" scoped>
.play-list {
  padding-bottom: 290px;
}
</style>
