<script setup>
import { useWyUserStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService } from '@/api/wyy/user'
import { FormOutlined } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import playListItem from './components/playListItem.vue'
import songListDetail from '@/components/songList/songListDetail.vue'
const wyUserStore = useWyUserStore()
const route = useRoute()
const router = useRouter()
// tag默认选中
const activeKey = ref('1')

const playList = ref([])
// 收藏的歌单
const collectPlayList = ref([])
getUserPlaylistService(wyUserStore.user.userInfo.userId).then((res) => {
  console.log(res)
  console.time('循环筛选收藏歌单 耗时')
  res.playlist.forEach((item) => {
    if (item.ordered) {
      console.log('收藏歌单')
      collectPlayList.value.push(item)
    } else {
      playList.value.push(item)
    }
  })
  console.timeEnd('循环筛选收藏歌单 耗时')
})

// 跳转歌单详情
const goPlayListDetail = (item) => {
  if (item.name === `${wyUserStore.user.userInfo.nickname}喜欢的音乐`) {
    router.push('likedSongs')
    return
  }
  router.push({
    path: '/playListDetail',
    query: {
      id: item.id
    }
  })
}
</script>

<template>
  <songListDetail :list="wyUserStore.user.userInfo" :isUser="true">
    <template #content>
      <h2>我创建的歌单</h2>
      <div class="play-list">
        <playListItem
          class="item"
          v-for="item in playList"
          :item="item"
          @click="goPlayListDetail(item)"
        ></playListItem>
      </div>
      <h2>我收藏的歌单</h2>
      <div class="play-list">
        <playListItem
          class="item"
          v-for="item in collectPlayList"
          :item="item"
          @click="goPlayListDetail(item)"
        ></playListItem>
      </div>
    </template>
  </songListDetail>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  .header {
    display: flex;
    align-items: center;
    padding: 20px;
    .user-avatar {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .r {
        margin-bottom: 10px;
      }
      .user-name {
        font-size: 20px;
        font-weight: 700;
        margin: 10px 0;
        .edit-icon {
          cursor: pointer;
          font-size: 20px;
          color: #999;
        }
      }
    }
  }
  // 内容
  .content {
    height: 100vh;
    .play-list {
      width: 100%;
      // height: 100%;
      margin: 10px 0;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      // 每个歌单
      .item {
        margin-right: 20px;
        margin-top: 20px;
      }
    }
  }
}
</style>
