<script setup>
import { ref, watch } from 'vue'
import { getLyricService } from '@/api/wyy/song'
import { useAudioStore } from '@/stores/index'
const audioStore = useAudioStore()
// 定义一个歌词数组用于页面渲染
const lyricList = ref([])
// 获取歌词方法
const getLyric = async () => {
  // 异步接口调用
  const res = await getLyricService(audioStore.playList[audioStore.playStatus.currentIndex].songId)
  // 歌词
  console.log(res)
  const lyric = res.lrc.lyric
  // 将歌词字符串格式化后赋值给数据源
  lyricList.value = formatLyric(lyric)
}
// 处理在没有音乐时 不请求歌词
if (audioStore.playList[0].url !== null) {
  getLyric()
}
/**
 * 将歌词字符串解析为歌词数组
 * @param {*} lyric 歌词字符串 如 ""
 * @returns array 如： [{ time: "31.52", words: "你是 遥遥的路" }]
 */
const formatLyric = (lyric) => {
  const lyricList = []
  // 定义一个暂存变量接收日期字符串
  let timeStr = ''
  // 把歌词数组用换行符\n分割成数组
  lyric.split('\n').forEach((item) => {
    // 去除最后一行分割的空字符串
    if (item === '') return
    // item 如 "[00:31.52]你是 遥遥的路"
    // parts 如 ["[00:31.52","你是 遥遥的路"]
    const parts = item.split(']')
    // timeStr 如 00:31.52
    timeStr = parts[0].slice(1)
    // 空歌词不要
    if (parts[1] !== ' ' && parts[1] !== '') {
      lyricList.push({
        time: parseTime(timeStr),
        words: parts[1],
        // 人造id
        uid: Math.random().toString().slice(-6)
      })
    }
  })
  return lyricList
}
/**
 * 将时间字符串解析为秒
 * @param {*} timeStr 时间字符串
 * @returns 秒
 */
const parseTime = (timeStr) => {
  const parts = timeStr.split(':')
  return +parts[0] * 60 + +parts[1]
}

// 歌词的包裹容器dom
const lyricWarp = ref(null)
// 歌词内容体dom
const lyricUl = ref(null)
// 每一条歌词的dom
const lyricLi = ref(null)
// 当前激活的歌词索引
const lyricIndex = ref(0)
// 当前播放时间
let currentTime = ''
// 音频播放时间更新的事件
const audioTime = (e) => {
  // 当前播放的时间
  currentTime = e
  for (let i = 0; i < lyricList.value.length; i++) {
    // 如果播放时间大于当前歌曲条目的时间
    if (currentTime > lyricList.value[i].time) {
      // 赋值激活选项
      lyricIndex.value = i
      // 歌词内容体dom通过transform:translateY实现歌词滚动
      // console.log(lyricWarp.value.offsetHeight, lyricLi.value[0].offsetHeight)
      const translateY = lyricWarp.value.offsetHeight / 2 - lyricLi.value[0].offsetHeight * (i + 1)
      lyricUl.value.style.transform = `translateY(${translateY}px)`
    }
  }
}

watch(
  () => audioStore.playStatus.currentTime,
  (newVal) => {
    audioTime(newVal)
  },
  {
    deep: true
  }
)

const goTime = (item, index) => {
  console.log(item)
  audioStore.setProgress(item.time, 'seek')
  const translateY = lyricWarp.value.offsetHeight / 2 - lyricLi.value[0].offsetHeight * (index + 1)
  lyricUl.value.style.transform = `translateY(${translateY}px)`
}
</script>
<template>
  <!-- 歌词滚动包裹盒子 -->
  <div class="m-song-scroll" ref="lyricWarp">
    <!-- 歌词内容体 -->
    <div class="m-song-iner" ref="lyricUl">
      <!-- 每一条歌词item -->
      <div
        ref="lyricLi"
        class="m-song-lritem"
        v-for="(item, index) in lyricList"
        :key="item.uid"
        :class="{ activeLyric: lyricIndex === index }"
      >
        <span
          @click="goTime(item, index)"
          :class="{ blur: lyricIndex !== index }"
          class="m-song-lrori"
          >{{ item.words }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 歌词样式
// 歌词视口样式定高50px
.blur {
  filter: blur(1px);
}
.m-song-scroll {
  height: 300px;
  // text-align: center;
  color: hsla(0, 0%, 100%, 0.6);
  overflow: hidden;
  -webkit-mask: -webkit-linear-gradient(top, #000, #000 70%, rgba(0, 0, 0, 0));
  // 歌词内容体
  .m-song-iner {
    transition: transform 0.3s ease-out;
    // 每条歌词样式
    .m-song-lritem {
      // box-sizing: border-box;
      .m-song-lrori {
        display: block;
        font-size: 18px;
        height: 35px; // 需要定死高度--好计算
        line-height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // 苹方-简 中粗体
        font-family: 'myFont';
      }
    }
    // 激活歌词样式
    .m-song-lritem.activeLyric {
      .m-song-lrori {
        text-shadow: rgba(255, 255, 255, 0.8) 0 0 8px;
        background-color: rgba(255, 255, 255, 0.9);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-size: 28px;
        font-weight: 600;
      }
    }
  }
}
</style>
