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

const value = ref(0)
const audioStore = useAudioStore()
const volume = ref(50)
const isLoading = ref(false)
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

defineOptions({ name: 'foooterPlay' })
</script>

<template>
  <footer class="footer">
    <div class="footer-left">
      <!-- 歌曲封面 -->
      <div class="cover" @click="isShowPlayDetail = true">
        <img
          ref="coverRef"
          :src="audioStore.playList[audioStore.playStatus.currentIndex].cover"
          alt=""
        />
      </div>
      <!-- 歌曲信息 -->
      <div class="info">
        <p ref="songNameRef" class="song-name">
          {{ audioStore.playList[audioStore.playStatus.currentIndex].name }}
        </p>
        <p ref="authorRef" class="author">还没有请求</p>
      </div>
    </div>
    <div class="footer-center">
      <div class="box">
        <!-- 控制 -->
        <div class="control">
          <div class="c">
            <!-- 上一首 -->
            <BackwardOutlined class="icon" />
            <!-- 暂停 -->
            <PauseOutlined v-if="audioStore.playStatus.isPlay" @click="pause" class="icon" />
            <!-- 播放 -->
            <CaretRightOutlined v-else @click="play" class="icon" />
            <LoadingOutlined v-if="isLoading" />
            <!-- 下一首 -->
            <ForwardOutlined class="icon" />
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
            />
          </template>
          <SoundOutlined />
        </a-popover>
      </div>
    </div>
  </footer>
  <playDetail @close="isShowPlayDetail = false" :open="isShowPlayDetail" :img="coverRef" />
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
  background-color: #fff;
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
  }
}
</style>
