<script setup>
import { ref, watch } from 'vue'
import {
  SoundOutlined,
  BackwardOutlined,
  PauseOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { useAudioStore } from '@/stores/index'
import { formatTime } from '@/utils/formatTime'
import inputR from '../footerPlay/inputR.vue'
import playDetail from './playDetail.vue'
import { computed } from '@vue/reactivity'
import logo from '@/assets/audio.svg'
import { message } from 'ant-design-vue'
const value = ref(0)
const audioStore = useAudioStore()
const volume = ref(50)
const isLoading = ref(false)

const props = defineProps({
  device: {
    // 设备 标识 | mobile 移动端 pc 电脑端
    type: String,
    default: 'pc'
  }
})
const play = () => {
  audioStore.play()
}
const pause = () => {
  audioStore.pause()
}
// 监听进度
watch(
  audioStore.playStatus,
  () => {
    value.value = audioStore.playStatus.progress
  },
  {
    immediate: true,
    deep: true
  }
)
// 设置进度
const setProgress = (e) => {
  audioStore.setProgress(e)
}

// 设置音量
const setVolume = (e) => {
  audioStore.setVolume(e)
}

const isShowPlayDetail = ref(false)
const coverRef = ref()

// 上一首
const prev = () => {
  audioStore.prev()
}
// 下一首
const next = () => {
  audioStore.next()
}
const getCover = computed(() => {
  return audioStore.playList[audioStore.playStatus.currentIndex]?.cover || logo
})
const getSongName = computed(() => {
  return audioStore.playList[audioStore.playStatus.currentIndex]?.name || '暂无歌曲'
})
const getAuthor = computed(() => {
  return audioStore.playList[audioStore.playStatus.currentIndex]?.singer || '暂无歌手'
})
const showPlayDetail = () => {
  if (!audioStore.playList[audioStore.playStatus.currentIndex]) {
    message.warning('当前播放列表为空')
    return
  }
  isShowPlayDetail.value = true
}
defineOptions({ name: 'foooterPlay' })
</script>

<template>
  <footer class="footer">
    <div class="footer-left">
      <!-- 歌曲封面 -->
      <div class="cover" @click="showPlayDetail">
        <img ref="coverRef" :src="getCover" alt="" />
      </div>
      <!-- 歌曲信息 -->
      <div class="info hidden lg:block">
        <p ref="songNameRef" class="song-name">
          {{ getSongName }}
        </p>
        <p ref="authorRef" class="author">
          {{ getAuthor }}
        </p>
      </div>
    </div>
    <div class="footer-center">
      <div class="box">
        <!-- 控制 -->
        <div class="control">
          <div class="c">
            <!-- 上一首 -->
            <BackwardOutlined class="icon" @click="prev" />
            <!-- 暂停 -->
            <PauseOutlined v-if="audioStore.playStatus.isPlay" @click="pause" class="icon" />
            <!-- 播放 -->
            <CaretRightOutlined v-else @click="play" class="icon" />
            <LoadingOutlined v-if="isLoading" />
            <!-- 下一首 -->
            <ForwardOutlined class="icon" @click="next" />
          </div>
        </div>
        <div class="slider">
          <span>{{ formatTime(audioStore.playStatus.currentTime) }}</span>
          <inputR @input="setProgress" :value="value" :step="0.1" />
          <span>{{ formatTime(audioStore.playStatus.duration) }}</span>
        </div>
      </div>
    </div>
    <div class="footer-right">
      <div class="volume">
        <a-popover
          trigger="hover"
          :overlayInnerStyle="{
            height: '100px',
            width: '50px',
            display: 'flex',
            justifyContent: 'center'
          }"
        >
          <template #content>
            <a-slider
              v-model:value="volume"
              vertical
              :min="0"
              :max="100"
              :step="0.1"
              @change="setVolume"
              :tooltipOpen="false"
            />
          </template>
          <svg
            v-show="audioStore.audio.volume > 0"
            t="1720238128235"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4216"
            width="20"
            height="20"
          >
            <path
              d="M512 170.666667l-234.666667 192H128v298.666666h149.333333l234.666667 192V170.666667z"
              fill="#000000"
              p-id="4217"
            ></path>
            <!-- 音量0.1 -->
            <path
              v-show="audioStore.audio.volume >= 0.1"
              d="M530.282667 132.117333A42.666667 42.666667 0 0 1 554.666667 170.666667v682.666666a42.666667 42.666667 0 0 1-69.696 33.024L262.122667 704H128a42.666667 42.666667 0 0 1-42.666667-42.666667V362.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h134.101333l222.869334-182.357333a42.666667 42.666667 0 0 1 45.290666-5.546667zM469.333333 260.693333l-164.970666 134.997334A42.666667 42.666667 0 0 1 277.333333 405.333333H170.666667v213.333334h106.666666a42.666667 42.666667 0 0 1 27.029334 9.642666L469.333333 763.306667V260.693333zM676.736 712.469333A234.538667 234.538667 0 0 0 789.333333 512c0-84.906667-45.077333-159.253333-112.597333-200.448l-57.536 65.749333a149.333333 149.333333 0 0 1 0 269.397334l57.536 65.770666z"
              fill="#000000"
              p-id="4218"
            ></path>
            <path
              v-show="audioStore.audio.volume >= 0.5"
              d="M748.224 844.224C862.613333 777.728 939.52 653.845333 939.52 512c0-141.845333-76.906667-265.728-191.296-332.224l-56.874667 66.602667C787.562667 295.978667 853.333333 396.309333 853.333333 512c0 115.690667-65.792 216.021333-161.984 265.621333l56.874667 66.602667z"
              fill="#000000"
              p-id="4219"
            ></path>
          </svg>

          <!-- 静音 -->
          <svg
            v-show="audioStore.audio.volume === 0"
            t="1720238288828"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8033"
            width="20"
            height="20"
          >
            <path
              d="M851.968 591.36c-6.144 22.528-15.36 44.032-26.624 64.512s-25.088 38.912-40.96 55.808c-15.872 16.896-32.768 31.744-51.712 44.544-5.632 4.608-12.8 6.656-20.48 6.656-9.728 0-18.432-3.584-25.6-10.752-7.168-7.168-10.752-15.872-10.752-25.6 0-10.752 4.096-19.968 12.288-27.648 0.512-0.512 1.024-1.024 1.536-1.024 0.512 0 1.024-0.512 1.536-1.024l0.512-0.512c13.824-9.216 26.624-20.48 38.4-33.28s22.016-26.624 30.72-41.984c8.704-14.848 15.872-31.232 20.48-48.128 5.12-16.896 7.168-34.816 7.168-52.736 0-36.864-9.216-70.656-28.16-101.376-18.432-30.72-41.984-55.808-69.632-75.264-10.24-7.168-15.36-17.408-15.36-29.696 0-9.728 3.584-18.432 10.752-25.6 7.168-7.168 15.36-10.752 25.6-10.752 8.192 0 15.872 2.56 22.016 8.192 17.92 12.8 34.816 27.648 50.688 44.544 15.872 16.896 29.184 35.328 40.448 55.296 11.264 19.968 19.968 41.472 26.624 64 6.144 22.528 9.728 46.08 9.728 70.144 0.512 25.6-2.56 49.152-9.216 71.68z"
              p-id="8034"
            ></path>
            <path
              d="M691.712 423.936c10.24 14.336 18.432 28.672 24.576 43.52 6.144 14.336 9.216 32.256 9.216 52.736 0 19.968-3.072 37.376-9.728 53.248-6.144 15.872-14.336 30.208-24.064 43.008-4.096 5.632-8.192 10.24-12.288 14.336-4.608 4.096-10.24 6.144-16.896 6.144-8.704 0-16.384-3.072-22.528-9.728-6.144-6.656-9.216-13.824-9.216-23.04 0-4.096 0.512-7.68 2.048-11.776h-0.512c2.56-5.632 5.632-10.752 8.704-15.36 3.584-5.12 6.656-10.24 9.728-15.36 3.072-5.12 5.632-11.264 8.192-17.92 2.048-6.656 3.072-14.848 3.072-24.064 0-8.704-1.024-16.896-3.072-23.552-2.048-6.656-5.12-12.8-8.192-17.92-3.072-5.632-6.656-10.752-9.728-15.36-3.584-5.12-6.144-10.24-8.192-15.36-1.536-3.584-2.048-7.168-2.048-11.776 0-8.704 3.072-16.384 9.216-23.04 6.144-6.656 13.824-9.728 22.528-9.728 6.656 0 12.288 2.048 16.896 6.144 4.096 4.608 8.704 9.728 12.288 14.848zM380.928 238.08c0.512 0 0.512-0.512 1.024-0.512 15.36-12.8 28.672-24.064 40.96-34.304 12.288-10.24 22.528-18.944 30.72-26.112 8.192-7.168 13.312-11.264 15.36-12.8 14.848-10.752 26.624-15.872 35.84-14.848 9.216 1.024 16.384 5.632 21.504 13.312s8.704 17.408 10.752 28.672c2.048 11.264 3.072 21.504 3.072 31.232v290.304L380.928 238.08zM539.648 653.312v168.96c0 9.216-1.536 19.456-5.12 30.208-3.584 10.752-8.704 18.944-15.872 25.088-7.168 6.144-15.872 8.704-26.624 7.68-10.752-1.024-23.04-8.192-37.376-21.504-25.088-22.528-51.712-46.592-79.36-71.168-28.16-24.576-53.76-47.616-77.824-68.096-28.16-23.552-55.808-47.104-83.968-70.144-5.632 0.512-10.752 0.512-16.384 0.512-4.608 0.512-9.216 0.512-13.824 0.512h-12.288c-13.312 0-24.064-4.096-32.256-12.288-8.192-8.192-12.288-17.92-12.288-29.184V428.032h0.512l-0.512-0.512c0-13.824 4.096-25.088 12.8-34.304 8.704-8.704 19.456-13.312 31.744-13.312h41.984c40.96-35.84 78.848-67.584 113.152-96.256l213.504 369.664z"
              p-id="8035"
            ></path>
            <path
              d="M181.76 112.128l29.696-18.432L696.32 891.904l-29.696 18.432z"
              p-id="8036"
            ></path>
          </svg>
        </a-popover>
      </div>
    </div>
  </footer>
  <playDetail @close="isShowPlayDetail = false" :open="isShowPlayDetail" />
</template>

<style lang="scss" scoped>
.footer {
  user-select: none;
  padding: 0 30px;
  width: 100%;
  height: 70px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  z-index: 1000;
  // 左侧部分
  .footer-left {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    // 封面
    .cover {
      cursor: pointer;
      width: 50px;
      height: 50px;
      margin: 0 10px;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      overflow: hidden;
      width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    // 信息
    .song-name {
      font-size: 16px;
    }
    .author {
      font-size: 14px;
      color: #999;
    }
  }
  // 中间部分
  .footer-center {
    width: 500px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // 盒子
    .box {
      width: 100%;
      height: 100%;
      // 控制
      .control {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        // 控制按钮
        .c {
          width: 180px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }
        .icon {
          font-weight: 500;
          font-size: 28px;
          cursor: pointer;
        }
      }
      .slider {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 12px;
        }
        .ipt {
          width: 80%;
        }
      }
    }
  }
  // 右侧部分
  .footer-right {
    width: 200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .volume {
      .icon {
        font-size: 20px;
        color: #000;
      }
      &::deep(.ant-slider-handle) {
        display: none !important;
      }
    }
  }
}
</style>
