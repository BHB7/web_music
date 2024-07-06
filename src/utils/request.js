import axios from 'axios'
import { useWyUserStore, useSettingsStore, useKgUserStore } from '@/stores'
import { message } from 'ant-design-vue'

const getApi = () => {
  const settingStore = useSettingsStore()
  const apiSelect = settingStore.settings.apiSelect
  console.log(apiSelect)
  switch (apiSelect) {
    case 'wyy': // 网易云
      return 'https://wyy.vocucc.cn'
    case 'kg': // 酷狗
      return 'https://kg.vocucc.cn'
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
    const kgUserStore = useKgUserStore()
    const settingStore = useSettingsStore()
    const apiSelect = settingStore.settings.apiSelect
    switch (apiSelect) {
      case 'wyy':
        // console.log('网易云');
        document.cookie = wyUserStore.user.cookie
        break
      case 'kg':
        // console.log('酷狗');
        document.cookie = kgUserStore.user.cookie
        config.data = {
          token: kgUserStore.user.cookie
        }
        break
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
    const config = err.config;
    if (config) {
      config.retry = config.retry || 0;
      if (config.retry < 6) {
        config.retry += 1;
        console.log(`重试次数: ${config.retry}`);
        const delay = new Promise(resolve => {
          setTimeout(() => resolve(), 1000); // 延迟1秒后重试
        });
        return delay.then(() => instance(config));
      }
    }

    if (err.response) {
      console.log(err.response)
      message.error('系统错误')
    } else {
      message.error('网络错误')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
