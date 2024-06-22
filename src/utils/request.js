import axios from 'axios'
import { useWyUserStore, useSettingsStore } from '@/stores'
import { message } from 'ant-design-vue'

const getApi = () => {
  const settingStore = useSettingsStore()
  const apiSelect = settingStore.settings.apiSelect
  console.log(apiSelect)
  switch (apiSelect) {
    case 'wyy':
      return 'https://www.vocucc.cn'
    case 'kg':
      return 'https://ku-gou-music-api-omega.www.vocucc.cn'
    default:
      return 'http://localhost:3000'
  }
}

let baseURL = 'http://localhost:3000'

const instance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const newBaseURL = getApi() // 获取新的 baseURL
    config.baseURL = newBaseURL // 设置新的 baseURL 到 config
    const wyUserStore = useWyUserStore()
    if (wyUserStore.user.cookie) {
      document.cookies = wyUserStore.user.cookie
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response) {
      console.log(err.response)
      message.error('系统错误')
    } else {
      message.error('服务器异常')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
