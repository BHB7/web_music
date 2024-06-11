import request from '@/utils/request'

// 获取用户歌单
export const userPlaylistServe = (id) => request.get(`/user/songlist?id=${id}`)
// 通过dirid获取歌单详情
export const songListInfoServe = (tid) => request.get(`/songlist?id=${tid}`)
// 获取推荐歌单
export const songListRecommendServe = () => request.get('/recommend/playlist/u')
// 按分类获取歌单
/**
 * id: 分类id，默认为 3317 // 3317: 官方歌单，59：经典，71：情歌，3056：网络歌曲，64：KTV热歌
pageNo: 页码，默认为 1
pageSize: 每页返回数量，默认为 20
/recommend/playlist
 */
export const songListCategoryServe = (id, pageNo, pageSize) =>
  request.get(
    `/recommend/playlist?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`
  )

// /songlist/list
/**pageSize: 默认为 20

pageNo: 默认为1

sort: 默认是 5，// 5: 推荐，2: 最新，其他数字的排列值最后都会返回推荐

category: 分类 id，默认 10000000 （全部），其他值从上面的分类接口获取 */
export const songListListServe = (
  pageSize = 20,
  pageNo = 1,
  sort = 5,
  category = 10000000
) =>
  request.get(
    `/songlist/list?pageSize=${pageSize}&pageNo=${pageNo}&sort=${sort}&category=${category}`
  )

// 日推歌单 /recommend/daily
export const recommendDailyServe = () => request.get('/recommend/daily')
