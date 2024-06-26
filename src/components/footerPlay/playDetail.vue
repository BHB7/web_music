<script setup>
import { DownOutlined, ArrowsAltOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import inputR from './inputR.vue'
import { formatTime } from '@/utils/formatTime'
import { useAudioStore } from '@/stores/index'
import { nextTick, onMounted, ref, watch } from 'vue'
import lyrics from '../lyrics.vue'
// 导入动画库
import gsap from 'gsap'
// 背景
import bgColor from '../bgColor.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: () => false
  },
  img: {
    type: Object
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
  // console.log('设置值' + e)
  audioStore.setProgress(e)
}

// 设置音量
const setVolume = (e) => {
  // console.log('设置音量' + e)
  audioStore.setVolume(e)
}
const emit = defineEmits(['close'])
const mianRef = ref()

onMounted(() => {
  watch(
    () => props.open,
    (newVal) => {
      if (newVal) {
        // 禁止body滚动
        document.body.style.overflow = 'hidden'
        console.log('打开')
        nextTick(() => {
          gsap.to(mianRef.value, {
            opacity: 1,
            duration: 0.5,
            // 向上移入屏幕
            ease: 'power2.out',
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
    y: '100%',
    ease: 'power2.in',
    onComplete: () => {
      // console.log('动画结束')
      // 恢复滚动
      document.body.style.removeProperty('overflow')
      emit('close')
    }
  })
}
</script>
<template>
  <main class="main" ref="mianRef" v-if="props.open">
    <bgColor :img="props.img" class="bg"></bgColor>
    <div class="play-detail">
      <header class="header">
        <div class="l">
          <!-- 收起 -->
          <DownOutlined class="icon" @click="close" />
          <!-- 全屏 -->
          <ArrowsAltOutlined class="icon" />
        </div>
        <div class="c"><span>播放详情</span></div>
        <div class="r">
          <section class="style-btn">播放器样式</section>
        </div>
      </header>
      <section class="cont flex md:justify-center md:items-stretch lg:justify-evenly">
        <!-- 左边操作面板 -->
        <section class="l px-10">
          <div class="line"></div>
          <div
            :class="{ play: audioStore.playStatus.isPlay, noPlay: !audioStore.playStatus.isPlay }"
            class="cover"
          >
            <img :src="img.src" alt="" />
          </div>
          <!-- 歌曲信息 -->
          <div class="info">
            <div class="desc">
              <div class="p">
                <p class="song-name">
                  {{ audioStore.playList[audioStore.playStatus.currentIndex].name }}
                </p>
                <p class="author">
                  {{ audioStore.playList[audioStore.playStatus.currentIndex].singer }}
                </p>
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
            <i class="iconfont size icon-applemusicicon_06" v-else @click="pause"></i>
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
  opacity: 0;
  // border: 1px solid #000;
  // background-color: rgb(19, 19, 19);
  z-index: 1000;
  .bg {
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    position: fixed;
  }
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
    // 中间
    .c {
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      background-color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      font-size: 18px;
      backdrop-filter: blur(20px);
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
    // display: flex;
    // justify-content: space-evenly;
    .l {
      min-width: 390px;
      max-width: 700px;
      flex: 3;
      margin: 20px 0;
      // padding: 0 70px;
      // width: 30%;
      // height: 100vh;
      display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: center;
      // border: 1px solid #000;
      // 小白条
      .line {
        margin: 10px 0;
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
      .play {
        transition: all 0.4s ease-in;
        // .cover{
        transform: scale(1.1);
        // }
      }
      .noPlay {
        transition: all 0.4s ease-out;
        transform: scale(1);
      }
      // 封面
      .cover {
        display: flex;
        justify-content: center;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        box-shadow:
          rgba(0, 0, 0, 0.3) 0px 19px 38px,
          rgba(0, 0, 0, 0.22) 0px 15px 12px;
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
          // 歌名
          .song-name {
            background-clip: text;
            font-size: 20px;
            font-weight: 600;
            color: transparent;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
          }
          // 歌手
          .author {
            background-clip: text;
            font-size: 16px;
            color: transparent;
            background-color: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
          }
        }
        // 时间
        .time {
          padding: 0 18px;
          font-size: 12px;
          color: transparent;
          display: flex;
          background-clip: text;
          -webkit-background-clip: text;
          background-color: rgba(255, 255, 255, 0.3);
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
        .iconfont {
          position: relative;
          // 悬停效果
          &:hover {
            &::after {
              content: '';
              position: absolute;
              width: 2.8rem;
              height: 2.8rem;
              background-color: rgba(255, 255, 255, 0.3);
              backdrop-filter: blur(20px);
              border-radius: 50%;
              top: 50%;
              left: 50%;
              padding: 6px;
              transform: translate(-50%, -50%);
              z-index: -1;
              opacity: 0;
              transition: all 0.3s ease;
              animation: op 0.3s ease-out forwards;
              border: 1px solid rgba(0, 0, 0, 0.1);
            }
            @keyframes op {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          }
        }
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
      // width: 400px;
      // min-width: 200px;
      // max-width: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active {
      padding: 2px;
      border-radius: 5px;
      background-clip: text;
      -webkit-background-clip: text;
      backdrop-filter: blur(10px);
    }
  }
}
</style>
