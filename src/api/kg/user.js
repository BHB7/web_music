import request from '@/utils/request'

// 二维码登录 二维码登录涉及到 3 个接口,调用务必带上时间戳,防止缓存
let qrKey = ''
// 二维码生成接口
export const getQrCodeService = async () => {
    // 1.二维码 key 生成接口
    const res = await request({ url: `/login/qr/key?timestamp=${Date.now()}` })
    // console.log(res)
    qrKey = res.data.qrcode
    return request({ url: `/login/qr/create?key=${qrKey}&qrimg=true&timestamp=${Date.now()}` })
}
// 3.二维码检测扫码状态接口
// 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回502,则需加上noCookie参数,如&noCookie=true
export const getQrCheckService = (key = qrKey) => {
    return request({ url: `/login/qr/check?key=${key}&timestamp=${Date.now()}&noCookie=true` })
}


// 获取用户歌单
export const getUserPlaylistService = (pagesize = 30, page = 0) => {
    return request({
        url: '/user/playlist',
        params: {
            pagesize,
            page
        }
    })
}

// 刷新登录
// 说明 : 调用此接口，可刷新登录状态，可以延长 token 过期时间
export const getLoginStatusService = (token, userid) => {
    console.log(token, userid);
    return request({
        url: '/login/token',
        data: {
            token: token,
            userid: userid
        }
    })
}
