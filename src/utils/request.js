import axios from 'axios'
import { useQQUserStore } from '@/stores'
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
    // const userStore = useUserStore()
    // if (userStore.cookie) {
    //   document.cookie = userStore.cookie
    // }
    return config
  },
  (err) => Promise.reject(err)
)
/**
 * 100 表示成功，
 * 500 表示穿参错误，
 * 400 为 node 捕获的未知异常，
 * 301 表示缺少用户登陆的 cookie
 */
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
