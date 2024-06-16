<script setup>
import { onMounted, ref } from 'vue'
import songListDetail from '@/components/songListDetail.vue'
import { useWyUserStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService, getPlaylistDetailService } from '@/api/wyy/user'
import { useRoute } from 'vue-router'
const wyUserStore = useWyUserStore()
const playListId = ref('')
const route = useRoute()
console.log(wyUserStore.user.userInfo.userId)
const playList = ref()
onMounted(() => {
  // 获取用户歌单
  getUserPlaylistService(route.query.uid).then((res) => {
    playListId.value = res.playlist[0].id
    // 获取歌单详情
    getPlaylistDetailService(res.playlist[0].id).then((res) => {
      playList.value = res.playlist
    })
  })
})
</script>
<template>
  <songListDetail :list="playList"></songListDetail>
</template>
