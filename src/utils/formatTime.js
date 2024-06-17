export const formatTime = (time) => {
  const minutes =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}

// 时间戳 转换 2022-01-01
export const formatDate = (time) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

// 330118 时间戳毫秒 转换为 歌曲时长
export const formatSongDuration = (time) => {
  const minutes = Math.floor((time / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((time / 1000) % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}