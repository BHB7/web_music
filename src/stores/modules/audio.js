import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAudioStore = defineStore('audio', () => {
  const audio = ref(new Audio())
  const timer = ref(null)
  const playStatus = ref({
    currentTime: 0, // 当前播放时间
    duration: 0, // 总时长
    isPlay: false,
    // 暂停时的播放进度
    pauseTime: 0,
    // 计算的播放进度
    progress: 0
  })
  const playList = ref([
    {
      url: 'http://isure.stream.qqmusic.qq.com/C400001xfRJ942kiUA.m4a?guid=2796982635&vkey=6FA1B9D92DF643789E7C0CD5ABD108360A03654901C45D85A9CEA1141D190566501C0FD172BF9D026620CE45DB09D096D298C23B52E1AB85&uin=&fromtag=120032&src=C400002lGKZx2inQN5.m4a',
      cover: '@/assets/logo.svg',
      name: '三年之约 - CablT Yout',
      singer: 'CablT Yout'
    }
  ])

  const addSong = (song) => {
    playList.value.unshift(song)
  }
  const play = () => {
    audio.value.load()
    if (playStatus.value.pauseTime > 0) {
      audio.value.currentTime = playStatus.value.pauseTime
    }
    audio.value.src = playList.value[0].url
    audio.value.play()
  }

  const pause = () => {
    audio.value.pause()
  }
  // 设置播放进度
  const setProgress = (progress) => {
    if (!playStatus.value.isPlay) {
      playStatus.value.pauseTime = playStatus.value.duration * (progress / 100)
    }
    // 防抖
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      console.log('progress')
      audio.value.currentTime = playStatus.value.duration * (progress / 100)
    }, 100)
  }
  // 设置音量
  const setVolume = (volume) => {
    audio.value.volume = volume / 100
  }
  // 获取音频的播放时长
  audio.value.oncanplay = () => {
    console.info('进入可播放状态,音频总长度:' + audio.value.duration)
    playStatus.value.duration = audio.value.duration
  }
  // 开始播放
  audio.value.onplay = () => {
    audio.value.volume = 0.5 // 默认音量
    playStatus.value.isPlay = true
    console.info('开始播放')
  }

  audio.value.onwaiting = () => {
    console.info('缓冲中...')
  }
  // 播放结束
  audio.value.onended = () => {
    playStatus.value.isPlay = false
    console.info('播放结束')
  }
  audio.value.onerror = () => {
    playStatus.value.isPlay = false
    console.info('播放出错')
    message.error('播放出错')
  }
  // 暂停播放
  audio.value.onpause = () => {
    playStatus.value.isPlay = false
    // console.info('暂停播放, 记录进度:' + audio.value.currentTime)
    // 记录播放进度
    playStatus.value.pauseTime = audio.value.currentTime
  }
  audio.value.ontimeupdate = () => {
    // console.info('播放进度:' + audio.value.currentTime)
    playStatus.value.currentTime = audio.value.currentTime

    // 计算播放进度的百分比 进度条的百分比可以通过当前播放进度除以歌曲的总时长，然后乘以100来得到。
    const playProgress = audio.value.currentTime
    const duration = playStatus.value.duration
    // console.log('百分比' + (playProgress / duration) * 100)
    playStatus.value.progress = (playProgress / duration) * 100
  }
  return {
    audio,
    play,
    pause,
    addSong,
    playList,
    playStatus,
    setProgress,
    setVolume
  }
})
