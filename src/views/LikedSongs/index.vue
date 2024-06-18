<script setup>
import { onMounted, ref } from 'vue'
import songListDetail from '@/components/songList/songListDetail.vue'
import { useWyUserStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService, getPlaylistDetailService } from '@/api/wyy/user'
import { getSongDetailService } from '@/api/wyy/song'
import { useRoute } from 'vue-router'
import songListTabel from '@/components/songList/songListTabel.vue'
const wyUserStore = useWyUserStore()
const playListId = ref('')
const route = useRoute()
console.log(wyUserStore.user.userInfo.userId)
const playList = ref()
// tag默认选中
const activeKey = ref('1')
onMounted(() => {
  // 获取用户歌单
  getUserPlaylistService(wyUserStore.user.userInfo.userId).then((res) => {
    playListId.value = res.playlist[0].id
    // 获取歌单详情
    getPlaylistDetailService(res.playlist[0].id).then((res) => {
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
</script>
<template>
  <!-- 歌单详情组件 -->
  <songListDetail :list="playList">
    <template #content>
      <!-- 标签Tab -->
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane style="height: 100%" key="1" tab="歌曲">
          <div class="play-list">
            <songListTabel :list="playList"></songListTabel>
          </div>
          <!-- <h2>我收藏的歌单</h2>
          <div class="play-list">a</div> -->
        </a-tab-pane>
        <a-tab-pane key="2" tab="评论" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="播客">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </template>
  </songListDetail>
</template>
