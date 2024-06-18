<script setup>
import { useWyUserStore, useAudioStore } from '@/stores'
import { NumberOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons-vue'
// import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { formatDate, formatSongDuration } from '@/utils/formatTime'
import { getSongUrlService } from '@/api/wyy/song'
import { computed } from '@vue/reactivity'
// const route = useRoute()
const props = defineProps({
  list: {
    type: Object,
    default: () => ({})
  },
  isUser: {
    type: Boolean,
    default: () => false
  }
})
</script>
<template>
  <!-- 公共通用 详情 模板组件 -->
  <main class="main">
    <header class="header">
      <!-- 用户头像 / 歌单封面 -->
      <div class="user-avatar">
        <img :src="props.isUser ? list.avatarUrl : props?.list.coverImgUrl" alt="" />
      </div>
      <!-- 用户信息 / 歌单信息 -->
      <div class="user-info">
        <div class="user-name r">{{ props.isUser ? props.list.nickname : props.list.name }}</div>
        <div class="user-create r" v-if="!props.isUser">
          <!-- 头像 -->
          <div class="avatar" @click="$router.push('/userDetail')">
            <img :src="props?.list.creator?.avatarUrl" alt="" />
          </div>
          <!-- 昵称 -->
          <div class="nickname">
            {{ props.isUser ? list.nickname : props?.list.creator?.nickname }}
          </div>
          <!-- 创建时间 -->
          <div class="create-time" v-if="!props.isUser">
            {{ formatDate(props?.list.createTime) }} 创建
          </div>
        </div>
        <div class="user-level-desc r" v-if="props.isUser">简介：{{ list.signature }}</div>
      </div>
    </header>
    <!-- 内容 -->
    <section class="content">
      <!-- 插槽 -->
      <slot name="content" :list="props.list"></slot>
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
      border-radius: 12px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: space-between;
      .user-create {
        display: flex;
        align-items: center;

        .avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .nickname {
          margin: 0 10px;
        }
        .create-time {
          color: #999;
        }
      }
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
      // 表格
      .tabel {
        display: block;
        height: 100%;
        width: 100%;
        .like-icon {
          color: red;
          font-size: 18px;
        }
        .h-t {
          width: 300px;
          .icon {
            margin: 0 18px;
          }
        }
        .tbody {
          .song-info {
            display: flex;
            align-items: center;
            .start {
              // width: 100px;
              // 序号
              .index {
                font-size: 16px;
                font-weight: 600;
                margin: 0 18px;
                color: #959aa5;
              }
              .btn {
                cursor: pointer;
                font-size: 18px;
                margin: 0 18px;
              }
            }
            // 封面
            .cover {
              min-width: 50px;
              width: 50px;
              height: 50px;
              border-radius: 5px;
              margin: 0 10px;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            // 歌单信息
            .info {
              display: flex;
              flex-direction: column;
              .song-name {
                font-weight: 600;
                font-size: 16px;
                color: #283248;
              }
              .author {
                display: flex;
                // 音乐音质
                .timbre {
                }
                // 歌手
                .name {
                  color: #959aa5;
                  margin: 0 10px;
                }
              }
            }
          }
        }
      }
      // 每个歌单
      .item {
        margin-right: 20px;
        margin-top: 20px;
      }
    }
  }
}
</style>
