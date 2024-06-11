import request from '@/utils/request'

// 设置用户cookie
export const setCookieServe = (cookie) => {
  return request.post('/user/setCookie', { data: cookie })
}

// 获取用户cookie id： QQ号或微信wxuin
export const getCookieServe = (id) => {
  return request.get('/user/getCookie', {
    params: {
      id
    }
  })
}
// 查看当前Cookie
export const cookieInfoServe = () => {
  return request.get('/user/cookie')
}
// 刷新登陆
export const refreshLoginServe = () => {
  return request.get('/user/refresh')
}
// 用户主页信息
/**
 * 返回中 mymusic 为喜欢的音乐，
 * mydiss 为用户创建的歌单，
 * 需要注意的是，喜欢的音乐中的歌单id为 id，
 * 歌单中的歌单id为 dissid
 */
export const userInfoServe = (id) => {
  return request.get('/user/detail', {
    params: {
      id
    }
  })
}
