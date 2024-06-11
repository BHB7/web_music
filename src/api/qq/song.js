import request from '@/utils/request'

// 获取歌曲详情
export const getSongDetailServe = (songMid) =>
  request.get(`/song?songmid=${songMid}`)

// 根据获取的歌单dirid歌曲id、mid的哈希表 songlist/map?dirid
export const getSongListMapServe = (dirid) =>
  request.get(`/songlist/map?dirid=${dirid}`)

// 通过songmid 获取播放地址
export const getSongUrlServe = (songmid) =>
  request.get(`/song/urls?id=${songmid}`)

export const getLyricServe = (songmid) =>
  request.get(`/lyric?songmid=${songmid}`)
