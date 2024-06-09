<script setup>
import {
  DownOutlined,
  ArrowsAltOutlined,
  EllipsisOutlined
} from '@ant-design/icons-vue'
import inputR from './inputR.vue'
import { formatTime } from '@/utils/formatTime'
import { useAudioStore } from '@/stores/index'
import { nextTick, onMounted, ref, watch } from 'vue'
import lyrics from '../lyrics.vue'
// 导入动画库
import gsap from 'gsap'

const props = defineProps({
  open: {
    type: Boolean,
    default: () => false
  }
})
const audioStore = useAudioStore()
const value = ref(0)
const volume = ref(50)
// const isLoading = ref(false)
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
  console.log('设置值' + e)
  audioStore.setProgress(e)
}

// 设置音量
const setVolume = (e) => {
  console.log('设置音量' + e)
  audioStore.setVolume(e)
}
const emit = defineEmits(['close'])
const mianRef = ref()

onMounted(() => {
  watch(
    () => props.open,
    (newVal) => {
      if (newVal) {
        console.log('打开')
        nextTick(() => {
          gsap.to(mianRef.value, {
            duration: 0.5,
            // 向上移入屏幕
            y: '-100%'
          })
        })
      }
    }
  )
})

// 关闭
const close = () => {
  gsap.to(mianRef.value, {
    opacity: 0,
    duration: 0.5,
    // 向下移出屏幕
    y: '200%'
  })
  setTimeout(() => {
    emit('close')
  }, 500)
}
</script>
<template>
  <main class="main" ref="mianRef" v-if="props.open">
    <div class="play-detail">
      <header class="header">
        <div class="l">
          <!-- 收起 -->
          <DownOutlined class="icon" @click="close" />
          <!-- 全屏 -->
          <ArrowsAltOutlined class="icon" />
        </div>
        <div class="c">播放详情</div>
        <div class="r">
          <section class="style-btn">播放器样式</section>
        </div>
      </header>
      <section class="cont">
        <!-- 左边操作面板 -->
        <section class="l">
          <div class="line"></div>
          <div class="cover">
            <img src="@/assets/test.png" alt="" />
          </div>
          <!-- 歌曲信息 -->
          <div class="info">
            <div class="desc">
              <div class="p">
                <p class="song-name">歌曲名</p>
                <p class="author">歌手</p>
              </div>
              <!-- 更多 -->
              <EllipsisOutlined class="icon" />
            </div>
            <!-- 进度条 -->
            <inputR
              :type="'normal'"
              :step="0.1"
              style="margin: 30px 0"
              @input="setProgress"
              :value="value"
            />
            <!-- 时间 -->
            <div class="time">
              <!-- 开始时间 -->
              <div class="start">
                {{ formatTime(audioStore.playStatus.currentTime) }}
              </div>
              <!-- 结束时间 -->
              <div class="duration">
                {{ formatTime(audioStore.playStatus.duration) }}
              </div>
            </div>
          </div>
          <!-- 操作 -->
          <div class="controller">
            <!-- 随机 -->
            <i class="iconfont icon-suijibofang"></i>
            <!-- 上一曲 -->
            <i class="iconfont icon-applemusicicon_08"></i>
            <!-- 播放 -->
            <i
              class="iconfont size icon-applemusicicon_07"
              v-if="!audioStore.playStatus.isPlay"
              @click="play"
            ></i>
            <!-- 暂停 -->
            <i
              class="iconfont size icon-applemusicicon_06"
              v-else
              @click="pause"
            ></i>
            <!-- 下一曲 -->
            <i class="iconfont icon-applemusicicon_09"></i>
            <!-- 单曲循环 -->
            <i class="iconfont icon-bofang-xunhuanbofang active"></i>
          </div>
          <!-- 音量 -->
          <div class="volume">
            <i class="iconfont icon-yinliang-wu"></i>
            <inputR :type="'normal'" @input="setVolume" :value="volume" />
            <i class="iconfont icon-yinliang-zhong"></i>
          </div>
        </section>
        <!-- 右边 歌词 -->
        <div class="lyrics">
          <lyrics></lyrics>
        </div>
      </section>
      <footer class="footer"></footer>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  user-select: none;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 100%;
  left: 0;
  // border: 1px solid #000;
  background-color: rgb(19, 19, 19);
  z-index: 1000;
  .header {
    padding: 0 35px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .l {
      .icon {
        cursor: pointer;
        color: #fff;
        margin: 0 10px;
        font-size: 22px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(20px);
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .r {
      .style-btn {
        cursor: pointer;
        color: #ffffff;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(20px);
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .cont {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    .l {
      min-width: 500px;
      max-width: 700px;
      flex: 3;
      margin: 20px 0;
      padding: 0 70px;
      // width: 30%;
      // height: 100vh;
      display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: center;
      // border: 1px solid #000;
      // 小白条
      .line {
        position: relative;
        &::after {
          content: '';
          width: 30px;
          height: 5px;
          border-radius: 10px;
          position: absolute;
          top: -20px;
          left: 50%;
          backdrop-filter: blur(10px);
          transform: translateX(-50%);
          background-color: #fff;
        }
      }
      // 封面
      .cover {
        display: flex;
        justify-content: center;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        box-shadow:
          rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
          rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
        img {
          width: 100%;
          height: 330px;
          object-fit: cover;
        }
      }
      // 歌曲信息
      .info {
        margin: 20px 0;
        // 文本描述
        .desc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            margin: 5px 0;
            text-align: start;
            color: #fff;
          }
          .icon {
            cursor: pointer;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #575350;
            font-size: 18px;
            color: #fff;
          }
          .song-name {
            font-size: 20px;
            font-weight: 500;
          }
          .author {
            font-size: 16px;
            color: #999;
          }
        }
        // 时间
        .time {
          padding: 0 18px;
          font-size: 12px;
          color: #575350;
          display: flex;
          justify-content: space-between;
        }
      }
      .iconfont {
        cursor: pointer;
        color: #fff;
        font-size: 28px;
      }
      .size {
        font-size: 35px !important;
      }
      // 操作
      .controller {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .volume {
        padding: 0 16px;
        margin: 20px 0;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
    }
    // 歌词
    .lyrics {
      width: 400px;
      min-width: 200px;
      max-width: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active {
      padding: 2px;
      border-radius: 5px;
      color: #575350 !important;
      background-color: #9f9d9a;
      backdrop-filter: blur(10px);
    }
  }
}
</style>
