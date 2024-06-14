import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  setCookieServe,
  getCookieServe,
  cookieInfoServe,
  userInfoServe
} from '@/api/qq/user'
export const useQQUserStore = defineStore(
  'qqUser',
  () => {
    const user = ref({
      cookie: '',
      info: {}
    })
    // 设置cookie
    const setUserCookie = async (cookie) => {
      document.cookie = cookie
      user.value.cookie = cookie
      setCookieServe(cookie)
    }
    const getUserCookie = async (id) => {
      // 设置
      await getCookieServe(id)
      // 获取个人信息
      const res = await userInfoServe(id)
      user.value.info = res.data
      // 获取
      const { data } = await cookieInfoServe()
      user.value.cookie = data
      return user.value.cookie
    }
    return {
      user,
      setUserCookie,
      getUserCookie
    }
  },
  {
    persist: {
      key: 'musicuser',
      storage: localStorage
    }
  }
)
