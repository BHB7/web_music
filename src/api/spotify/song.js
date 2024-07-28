import axios from "axios"
import { useSpotifyUser } from '@/stores'
const { user } = useSpotifyUser()

/**
 * 
 * @param { string } q 搜索的关键词 
 * @param { string } type 搜索的类型 "album""artist""playlist""track""show""episode""audiobook" 
 * @param { number } limit 返回的条数 
 * @example https://api.spotify.com/v1/search?q=薛之谦&type=artist&limit=1
 */
export const search = ({ q, type = 'track', limit = 1 }) => {
    console.log(q, type, limit);
    return axios.get('https://api.spotify.com/v1/search', {
        headers: {
            Authorization: `Bearer ${user.token}`
        },
        params: {
            q,
            type,
            limit
        }
    })
}