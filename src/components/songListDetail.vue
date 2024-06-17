<script setup>
import { useWyUserStore, useAudioStore } from '@/stores'
import { NumberOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { formatDate, formatSongDuration } from '@/utils/formatTime'
import { getSongUrlService } from '@/api/wyy/song'
import { computed } from '@vue/reactivity'
const wyUserStore = useWyUserStore()
const audioStore = useAudioStore()
// const route = useRoute()
const props = defineProps({
  list: {
    type: Object,
    default: () => ({})
  }
})
// tag默认选中
const activeKey = ref('1')
onMounted(() => {
  console.log(props.list)
})
const columns = [
  // 歌曲名
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '50%',
    hover: false
  },
  // 专辑
  {
    title: 'Album',
    dataIndex: 'album',
    key: 'album',
    hover: false
  },
  // 喜欢
  {
    title: 'Like',
    dataIndex: 'like',
    key: 'like',
    width: '10%',
    hover: false
  },
  // 时长
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: '10%',
    hover: false
  }
]
const data = [
  {
    key: '1',
    name: '演员',
    album: '专辑名',
    like: true,
    time: '03:02'
  }
]
watch(
  // 监听多个值 只要有一个发生改变 都会触发
  () => [audioStore.playList, audioStore.playStatus.isPlay],
  (newVal, oldVal) => {
    // 判断当前播放歌曲是否在歌单中
    props.list?.songs?.forEach((item, index) => {
      if (item.al.id === audioStore.playList[audioStore.playStatus.currentIndex].id) {
        item.isPlay = audioStore.playStatus.isPlay
      } else {
        item.isPlay = false
      }
    })
  },
  {
    immediate: true,
    deep: true
  }
)
// 播放
const play = (row) => {
  // console.log('播放')
  // console.log(row)
  // 通过row 获取id 获取播放地址
  getSongUrlService(row.id).then((res) => {
    // console.log(res.data[0])
    audioStore.addSong({
      songId: res.data[0].id,
      id: row.al.id,
      url: res.data[0].url,
      cover: row.al.picUrl,
      name: row.name,
      singer: computed(() => {
        const nstr = row.ar.map((item) => {
          // console.log(item)
          return item.name
        })
        let str = ''
        nstr.forEach((item, index) => {
          if (index !== 0) {
            str += ' / '
          }
          str += item
        })
        return str
      })
    })
    // 播放
    audioStore.play()
  })
}
</script>
<template>
  <main class="main">
    <header class="header">
      <!-- 用户头像 -->
      <div class="user-avatar">
        <img :src="props?.list.coverImgUrl" alt="" />
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="user-name r">我喜欢的音乐</div>
        <div class="user-create r">
          <!-- 头像 -->
          <div class="avatar" @click="$router.push('/userDetail')">
            <img :src="props?.list.creator?.avatarUrl" alt="" />
          </div>
          <!-- 昵称 -->
          <div class="nickname">{{ props?.list.creator?.nickname }}</div>
          <!-- 创建时间 -->
          <div class="create-time">{{ formatDate(props?.list.createTime) }} 创建</div>
        </div>
        <div class="user-level-desc r">简介：</div>
      </div>
    </header>
    <!-- 内容 -->
    <section class="content">
      <!-- 标签Tab -->
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane style="height: 100%" key="1" tab="歌曲">
          <div class="play-list">
            <!-- 歌曲列表 表格 -->
            <a-table
              y
              sticky
              ellipsis
              class="tabel"
              :columns="columns"
              :data-source="props.list?.songs"
              :pagination="false"
            >
              <template #headerCell="{ column }">
                <!-- 标题表头 -->
                <template v-if="column.key === 'name'">
                  <span class="h-t">
                    <NumberOutlined class="icon" />
                    <span class="title">标题</span>
                  </span>
                </template>
                <template v-else-if="column.key === 'album'">
                  <span class="h-t">
                    <!-- <UserOutlined class="icon" /> -->
                    <span class="title">专辑</span>
                  </span>
                </template>
                <template v-else-if="column.key === 'like'">
                  <span class="h-t">
                    <!-- <UserOutlined class="icon" /> -->
                    <span class="title">喜欢</span>
                  </span>
                </template>
                <template v-else-if="column.key === 'time'">
                  <span class="h-t">
                    <!-- <UserOutlined class="icon" /> -->
                    <span class="title">时长</span>
                  </span>
                </template>
              </template>
              <!-- 列表内容 -->
              <template #bodyCell="{ index, column, record }">
                <!-- 标题 -->
                <div class="tbody">
                  <template v-if="column.key === 'name'">
                    <div class="song-info">
                      <!-- 序号 -->
                      <span class="start">
                        <span class="index">{{ index + 1 }}</span>
                        <!-- 播放按钮 -->
                        <span
                          v-if="!record.isPlay"
                          class="btn iconfont icon-applemusicicon_07"
                          @click="play(record)"
                        ></span>
                        <!-- 暂停按钮 -->
                        <span v-else class="btn iconfont icon-applemusicicon_06"> </span>
                      </span>

                      <!-- 封面 -->
                      <div class="cover">
                        <img :src="record.al.picUrl" alt="" />
                      </div>
                      <!-- 文本信息 -->
                      <div class="info">
                        <!-- 歌曲名 -->
                        <div class="song-name">{{ record.name }}</div>
                        <div class="author">
                          <!-- 歌曲品质 -->
                          <div class="timbre">图标占位</div>
                          <!-- 歌手 -->
                          <div class="name">{{ record.ar[0].name }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 专辑 -->
                  <template v-else-if="column.key === 'album'">
                    <span>
                      {{ record.al.name }}
                    </span>
                  </template>
                  <!-- 喜欢 -->
                  <template v-else-if="column.key === 'like'">
                    <span>
                      <!-- 不喜欢 -->
                      <HeartOutlined class="like-icon" v-if="false" />
                      <!-- 喜欢 -->
                      <HeartFilled class="like-icon" v-else />
                    </span>
                  </template>
                  <!-- 时长 -->
                  <template v-else-if="column.key === 'time'">
                    <span>{{ formatSongDuration(record.dt) }}</span>
                  </template>
                </div>
              </template>
            </a-table>
          </div>
          <h2>我收藏的歌单</h2>
          <div class="play-list">a</div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="评论" force-render>Content of Tab Pane 2</a-tab-pane>
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
