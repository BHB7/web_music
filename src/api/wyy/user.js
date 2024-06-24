import request from '@/utils/request'

// 二维码登录 二维码登录涉及到 3 个接口,调用务必带上时间戳,防止缓存
let qrKey = ''
// 二维码生成接口
export const getQrCodeService = async () => {
  // 1.二维码 key 生成接口
  const res = await request({ url: `/login/qr/key?timestamp=${Date.now()}` })
  qrKey = res.data.unikey || res.data.qrcode
  return request({ url: `/login/qr/create?key=${qrKey}&qrimg=true&timestamp=${Date.now()}` })
}
// 3.二维码检测扫码状态接口
// 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回502,则需加上noCookie参数,如&noCookie=true
export const getQrCheckService = (key = qrKey) => {
  return request({ url: `/login/qr/check?key=${key}&timestamp=${Date.now()}&noCookie=true` })
}

// 退出登录
export const logoutService = () => {
  return request('/logout')
}
// 登录状态
export const getLoginStatusService = (cookie) => {
  return request({
    url: '/login/status',
    method: 'post',
    data: {
      cookie
    }
  })
}
// 获取用户详情
export const getUserDetailService = () => {
  return request.get('/user/detail')
}
// 获取账号信息
// 说明 : 登录后调用此接口 ,可获取用户账号信息
export const getUserAccountService = () => {
  return request({
    url: '/user/account'
  })
}

// 手机号验证码登录
//  验证码,使用 /captcha/sent接口传入手机号获取验证码,调用此接口传入验证码,可使用验证码登录,传入后 password 参数将失效
export const phoneLoginService = (phone, password) => {
  return request({
    url: '/login/cellphone',
    method: 'post',
    params: {
      phone,
      password,
      timestamp: Date.now()
    }
  })
}

// 发送验证码
export const getCaptchaService = (phone) => {
  return request({
    url: '/captcha/sent',
    method: 'post',
    params: {
      phone
    }
  })
}
// 验证验证码
// 说明 : 调用此接口 ,传入手机号和验证码,可验证验证码是否正确
export const getCaptchaCheckService = (phone, captcha) => {
  return request({
    url: '/captcha/verify',
    method: 'post',
    params: {
      phone,
      captcha
    }
  })
}

// 获取用户等级信息
export const getUserLevelService = () => {
  return request({
    url: '/user/level'
  })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export const getUserSubcountService = () => {
  return request({
    url: '/user/subcount'
  })
}

// 获取用户歌单
export const getUserPlaylistService = (uid, limit = 30, offset = 0) => {
  return request({
    url: '/user/playlist',
    params: {
      uid,
      limit,
      offset
    }
  })
}
// 获取歌单详情
export const getPlaylistDetailService = (id) => {
  return request({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}
