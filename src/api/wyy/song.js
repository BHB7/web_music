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

/**
 * 获取音乐 url - 新版
 * @author 7z <1812287263@qq.com>
 * @param {number} id 歌曲id
 * @param {string} level 音质等级
 * @example getSongUrlService(id, level)
 */
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
/**
 * 
 * @param { String } ids 歌曲id 以,连接
 * @returns 以数组对象的形式
 * @example getSongDetailService('001,002,003')
 */
export const getSongDetailService = (ids) => {
    return request({
        url: '/song/detail',
        params: {
            ids
        }
    })
}