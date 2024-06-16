<script setup>
import { useWyUserStore } from '@/stores'
// 获取用户歌单
import { getUserPlaylistService } from '@/api/wyy/user'
import { FormOutlined } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import playListItem from './components/playListItem.vue'
const wyUserStore = useWyUserStore()
const route = useRoute()
// tag默认选中
const activeKey = ref('1')

const playList = ref([])
// 收藏的歌单
const collectPlayList = ref([])
getUserPlaylistService(route.query.uid).then((res) => {
  console.log(res)
  res.playlist.forEach((item) => {
    if (item.subscribed) {
      collectPlayList.value.push(item)
    } else {
      playList.value.push(item)
    }
  })
})
</script>

<template>
  <main class="main">
    <header class="header">
      <!-- 用户头像 -->
      <div class="user-avatar">
        <img :src="wyUserStore.user.userInfo.avatarUrl" alt="" />
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="user-name r">
          {{ wyUserStore.user.userInfo.nickname }}
          <!-- 编辑图标 -->
          <FormOutlined class="edit-icon" />
        </div>
        <div class="user-level r">LV.6</div>
        <div class="user-level-desc r">简介：{{ wyUserStore.user.userInfo.signature }}</div>
      </div>
    </header>
    <!-- 内容 -->
    <section class="content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="歌单">
          <h2>我创建的歌单</h2>
          <div class="play-list">
            <playListItem class="item" v-for="item in playList" :item="item"></playListItem>
          </div>
          <h2>我收藏的歌单</h2>
          <div class="play-list">
            <playListItem class="item" v-for="item in collectPlayList" :item="item"></playListItem>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="动态" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="播客">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </section>
  </main>
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
