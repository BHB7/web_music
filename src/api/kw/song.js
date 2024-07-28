import axios from "axios";

/**
 * 搜索音乐
 * @param {string} all 需要搜索的歌曲或歌手
 * @param {number} pn 查询的页码数
 * @param {number} rn 当前页的返回数量
 * @returns {Promise} 返回一个包含搜索结果的 Promise
 * @link http://search.kuwo.cn/r.s?all={0}&ft=music&itemset=web_2013&client=kt&pn={1}&rn={2}&rformat=json&encoding=utf8
 * @example http://search.kuwo.cn/r.s?all=周杰伦&ft=music&itemset=web_2013&client=kt&pn=0&rn=10&rformat=json&encoding=utf8
 */
export const search = (all, pn, rn = 20) => {
    return axios.get(`/kw/r.s`, {
        params: {
            all: all,
            ft: 'music',
            itemset: 'web_2013',
            client: 'kt',
            pn: pn,
            rn: rn,
            rformat: 'json',
            encoding: 'utf8'
        }
    })
}


/**
 * 获取播放地址
 * @param {number} musicID 音乐ID
 */
export const getPlayUrl = (musicID) => {
    return axios.get('http://mobi.kuwo.cn/mobi.s?f=web&source=jiakong&type=convert_url_with_sign', {
        params: {
            rid: musicID,
        }
    })
}