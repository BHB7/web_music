import request from '@/utils/request'


// 获取音乐 url - 新版
// level: 播放音质等级, 
// 分为 standard => 标准,
// higher => 较高, 
// exhigh=>极高, 
// lossless=>无损, 
// hires=>Hi-Res, 
// jyeffect => 高清环绕声, 
// sky => 沉浸环绕声, 
// jymaster => 超清母带
export const getSongUrlService = (id, level = 'standard') => {
    return request({
        url: '/song/url/v1',
        params: {
            id,
            level
        }
    })
}

// 获取歌词
export const getLyricService = (id) => {
    return request({
        url: '/lyric',
        params: {
            id
        }
    })
}

// 获取歌曲详情
export const getSongDetailService = (ids) => {
    return request({
        url: '/song/detail',
        params: {
            ids
        }
    })
}