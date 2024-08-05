import axios from "axios";

/**
 * 搜索音乐
 * @param {string} all 需要搜索的歌曲或歌手
 * @param {number} pn 查询的页码数
 * @param {number} rn 当前页的返回数量
 * @returns {Promise} 返回一个包含搜索结果的 Promise
 * @linkhttp://search.kuwo.cn/r.s?client=kt&all=%E5%86%99%E4%B8%8D%E5%AE%8C%E7%9A%84%E6%B8%A9%E6%9F%94%20G.E.M.%20%E9%82%93%E7%B4%AB%E6%A3%8B&pn=0&rn=25&uid=794762570&ver=kwplayer_ar_9.2.2.1&vipver=1&show_copyright_off=1&newver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1&issubtitle=1&_=1722735697339
 * @example http://search.kuwo.cn/r.s?all=周杰伦&ft=music&itemset=web_2013&client=kt&pn=0&rn=10&rformat=json&encoding=utf8
 */
export const search = (all, pn = 0, rn = 20) => {
    return axios.get(`/kws/r.s`, {
        params: {
            all: all,
            ft: 'music',
            // itemset: 'web_2013',
            client: 'kt',
            pn: pn,
            rn: rn,
            rformat: 'json',
            encoding: 'utf8',
            uid: 794762570,
            ver: 'kwplayer_ar_9.2.2.1',
            vipver: 1,
            vermerge: 1,
            show_copyright_off: 1,
            newver: 1,
            cluster: 0,
            strategy: 2012,
            mobi: 1,
            issubtitle: 1,
            _: +new Date().getTime()
        }
    })
}


/**
 * 获取播放地址
 * @param {number} musicID 音乐ID
 */
export const getPlayUrl = (musicID) => {
    return axios.get('https://mobi.kuwo.cn/mobi.s?f=web&source=jiakong&type=convert_url_with_sign', {
        params: {
            rid: musicID,
        }
    })
}

/**
 * 
 * 获取歌词
 * @param {number} musicID 音乐ID
 * @link https://kuwo.cn/openapi/v1/www/lyric/getlyric?musicId=908195&httpsStatus=1&reqId=74269100-4cb9-11ef-9674-29c2fe513ad0&plat=web_www&from=
 */
export const getLyric = (musicID) => {
    return axios.get(`https://kuwo.cn/openapi/v1/www/lyric/getlyric`, {
        params: {
            musicId: musicID,
            httpsStatus: 1,
            reqId: '74269100-4cb9-11ef-9674-29c2fe513ad0',
            plat: 'web_www',
            from: '='
        }
    })
}