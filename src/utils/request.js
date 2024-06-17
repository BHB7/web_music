import axios from 'axios'
import { useWyUserStore } from '@/stores'
import { message } from 'ant-design-vue'
const baseURL = 'http://localhost:3000'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
  withCredentials: true
  // TODO 2. 配置跨域请求头
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const wyUserStore = useWyUserStore()
    if (wyUserStore.user.cookie) {
      // console.log('设置cookie', wyUserStore.user.cookie)
      document.cookies = wyUserStore.user.cookie
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    return res.data
  },
  (err) => {
    if (err.response) {
      console.log(err.response)
      // TODO 6. 处理业务失败
      message.error('系统错误')
    } else {
      // TODO 7. 服务器异常
      message.error('服务器异常')
    }
    // TODO 5. 处理401错误
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
