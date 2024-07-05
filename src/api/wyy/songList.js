import request from '@/utils/request'

// 推荐歌单
export const getRecommendSongListService = (limit = 30) => {
    return request({
        url: '/personalized',
        params: {
            limit
        }
    })
}