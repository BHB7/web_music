<script setup>
import { useWyUserStore, useAudioStore, useViewMsgStore } from '@/stores'
import { NumberOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons-vue'
// import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { formatDate, formatSongDuration } from '@/utils/formatTime'
import { getSongUrlService } from '@/api/wyy/song'
import { computed } from '@vue/reactivity'
import loader from '../loader.vue'
import { getPlayUrl } from '@/api/kw/song'
const wyUserStore = useWyUserStore()
const audioStore = useAudioStore()
// const route = useRoute()
const viewMsgStore = useViewMsgStore() // 全局视图信息
const props = defineProps({
  list: {
    type: Object,
    default: () => ({})
  },
  art: {
    type: Number,
    default: () => 1 // 0: 用户喜欢歌单详情 1: 推荐歌单详情
  },
  type: {
    type: String,
    default: () => 'wyy'
  }
})

const getArt = computed(() => {
  return props.art === 0 ? viewMsgStore.likePlayListIsLoaded : viewMsgStore.playListDetailIsLoaded
})
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
    hover: false,
    ellipsis: true // 溢出显示省略号
  },
  // 专辑
  {
    title: 'Album',
    dataIndex: 'album',
    key: 'album',
    width: '10%',
    hover: false
  },
  // 喜欢
  {
    title: 'Like',
    dataIndex: 'like',
    key: 'like',
    width: '5%',
    hover: false
  },
  // 时长
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: '5%',
    hover: false
  }
]

// 监听设置歌单播放当前歌曲的状态
watch(
  // 监听多个值 只要有一个发生改变 都会触发
  () => [audioStore.playList, audioStore.playStatus.isPlay, audioStore.playStatus.isWaiting],
  (newVal, oldVal) => {
    // 判断当前播放歌曲是否在歌单中
    props.list?.songs?.forEach((item, index) => {
      if (item.al.id === audioStore.playList[audioStore.playStatus.currentIndex].id) {
        // item.isLoading = audioStore.playStatus.isWaiting
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

const songIds = ref([])

const playIndex = ref(0)
// 播放
const play = (row, index) => {
  console.log(row)
  playIndex.value = index
  row.isLoading = true
  // 筛选设置预加载数据
  songIds.value = props.list?.songs?.map((item) => {
    return {
      alId: item.al.id, // 用于定位当前播放的状态
      id: item.id,
      cover: item.al.picUrl,
      name: item.al.name,
      singer: computed(() => {
        const nstr = item.ar.map((item) => {
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
    }
  })
  switch (props.type) {
    case 'wyy':
      // 通过row 获取id 获取播放地址
      getSongUrlService(row.id).then((res) => {
        // console.log(res.data[0])
        row.isLoading = false
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
      break
    case 'kw':
      getPlayUrl(row.al.id).then((res) => {
        row.isLoading = false
        console.log(res.data.data.url)
        audioStore.addSong({
          songId: res.data.data.rid,
          id: row.al.id,
          url: res.data.data.url,
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
      break
    default:
      console.log('没有找到类型')
  }
  console.log(songIds.value)
  // console.log('播放')
  console.log(row)
}

// 监听音乐播放完成时 切换歌曲
watch(
  () => audioStore.playStatus.isNext,
  (n) => {
    if (n) {
      console.log('下一首触发')
      playIndex.value++
      if (playIndex.value >= songIds.value.length) {
        playIndex.value = 0
      }
      console.log(songIds.value[playIndex.value].id)
      switch (props.type) {
        case 'wyy':
          getSongUrlService(songIds.value[playIndex.value].id).then((res) => {
            console.log(res.data[0])
            audioStore.addSong({
              songId: res.data[0].id,
              id: songIds.value[playIndex.value].alId,
              url: res.data[0].url,
              cover: songIds.value[playIndex.value].cover,
              name: songIds.value[playIndex.value].name,
              singer: songIds.value[playIndex.value].singer.value
            })
            // 播放
            audioStore.play()
          })
          break
      }
    }
  },
  {
    deep: true
  }
)
// 暂停
const pause = () => {
  audioStore.pause()
}
const isLoading = ref(true)
</script>
<template>
  <!-- 歌曲列表 表格 -->
  <a-table
    y
    sticky
    ellipsis
    :locale="{ emptyText: getArt ? '加载中...' : '暂无歌曲' }"
    class="tabel"
    :columns="columns"
    :data-source="list?.songs"
    :pagination="false"
  >
    <template #headerCell="{ column }">
      <div class="header lg:block hidden">
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
        <!-- <template v-else-if="column.key === 'like'">
          <span class="h-t">
            <span class="title">喜欢</span>
          </span>
        </template> -->
        <template v-else-if="column.key === 'time'">
          <span class="h-t">
            <!-- <UserOutlined class="icon" /> -->
            <span class="title">时长</span>
          </span>
        </template>
      </div>
    </template>
    <!-- 列表内容 -->
    <template #bodyCell="{ index, column, record }">
      <!-- 标题 -->
      <div class="tbody">
        <template v-if="column.key === 'name'">
          <div class="song-info">
            <!-- 序号 -->
            <span class="start lg:w-auto w-50">
              <span class="index mx-4">{{ index + 1 }}</span>
              <!-- 加载 -->
              <loader class="btn" :size="18" v-if="record.isLoading"></loader>
              <!-- 播放按钮 -->
              <!-- 当未播放时 并且没有加载时 显示播放按钮 -->
              <span
                v-if="!record.isPlay ? !record.isLoading : !record.isPlay"
                class="btn iconfont icon-applemusicicon_07"
                @click="play(record, index)"
              ></span>
              <!-- 暂停按钮 -->
              <!-- 当播放时 并且没有加载时 显示暂停按钮 -->
              <span
                v-if="record.isPlay ? !record.isLoading : record.isPlay"
                @click="pause"
                class="btn iconfont icon-applemusicicon_06"
              >
              </span>
            </span>

            <!-- 封面 -->
            <div class="cover lg:block hidden">
              <img v-lazy :src="record.al.picUrl" alt="" />
            </div>
            <!-- 文本信息 -->
            <div class="info">
              <!-- 歌曲名 -->
              <div class="song-name">
                {{ record.name }}
              </div>
              <div class="author">
                <!-- 歌曲品质 -->
                <div class="timbre flex items-center">
                  <i v-if="record.sq">
                    <svg
                      t="1720244855005"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3161"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M588.458667 512V110.592h86.016V512a162.474667 162.474667 0 1 1-132.565334-159.744v89.344a76.458667 76.458667 0 1 0 46.293334 76.672l0.256-6.272z"
                        fill="#EBC78D"
                        p-id="3162"
                      ></path>
                      <path
                        d="M793.941333 110.592l-0.042666 401.365333 0.042666 0.042667a281.941333 281.941333 0 1 1-252.032-280.362667V318.293333a195.925333 195.925333 0 1 0 165.802667 202.88l0.213333-9.216V110.592h86.016z"
                        fill="#EBC78D"
                        p-id="3163"
                      ></path>
                      <path
                        d="M827.392 110.592h86.016V512a401.408 401.408 0 0 1-389.76 401.237333l-11.648 0.170667a401.408 401.408 0 1 1 29.866667-801.706667l0.042666 86.314667A315.392 315.392 0 1 0 827.392 512V110.549333z"
                        fill="#EBC78D"
                        p-id="3164"
                      ></path>
                    </svg>
                  </i>
                  <i v-else>
                    <svg
                      t="1720244920033"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3320"
                      width="25"
                      height="25"
                    >
                      <path
                        d="M776.78432119 674.94419766H247.21567881V349.05580234h529.56864238v325.88839532z m40.73604941-366.62444472H206.4796294v407.36049412h611.0407412V308.31975294z"
                        fill="#fc9302"
                        p-id="3321"
                      ></path>
                      <path
                        d="M338.44406147 410.58760498v122.20814825h101.84012353v40.73604941h-101.84012353v40.73604942h142.57617295v-122.20814824h-101.84012354v-40.73604942h101.84012354v-40.73604942h-122.20814825zM664.33245678 573.10407412v-162.94419766h-142.57617295v203.68024708h162.94419765v-40.73604942h-20.3680247z m-40.73604941 0h-61.10407412v-122.20814824h61.10407412v122.20814824z"
                        fill="#fc9302"
                        p-id="3322"
                      ></path>
                    </svg>
                  </i>
                </div>
                <!-- 歌手 -->
                <div class="name">{{ record.ar[0].name }}</div>
              </div>
            </div>
          </div>
        </template>
        <!-- 专辑 -->
        <template v-else-if="column.key === 'album'">
          <span class="lg:block hidden">
            {{ record.al.name }}
          </span>
        </template>
        <!-- 喜欢 -->
        <template v-else-if="column.key === 'like'">
          <span>
            <!-- 不喜欢 -->
            <!-- <HeartOutlined class="like-icon" v-if="false" /> -->
            <!-- 喜欢 -->
            <!-- <HeartFilled class="like-icon" v-else /> -->
          </span>
        </template>
        <!-- 时长 -->
        <template v-else-if="column.key === 'time'">
          <span class="lg:block hidden">{{ formatSongDuration(record.dt) }}</span>
        </template>
      </div>
    </template>
  </a-table>
</template>

<style lang="scss" scoped>
.play-list {
  width: 100%;
  // height: 100%;
  margin: 10px 0;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  &::deep(table tbody tr:hover > td) {
    background-color: #ffffff !important;
  }
  // 表格
  .tabel {
    display: block;
    height: 100%;
    width: 100%;
    padding-bottom: 240px !important;
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
          display: flex;
          align-items: center;
          // width: 100px;
          // 序号
          .index {
            font-size: 16px;
            font-weight: 600;
            // margin: 0 10px;
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
</style>
