import { getLoginStatusService } from '@/api/wyy/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWyUserStore = defineStore('wyUser', () => {
  const user = ref({
    cookie: '',
    userInfo: {}
  })
  const isLogin = ref(false)

  const setUserInfo = (userInfo) => {
    if (user.value) {
      user.value.userInfo = userInfo
    } else {
      console.error('user.value is undefined')
    }
  }

  const setCookie = (cookie) => {
    if (user.value) {
      user.value.cookie = cookie
      getUserInfo(cookie)
      isLogin.value = true
    } else {
      console.error('user.value is undefined')
    }
  }

  const getUserInfo = async (cookie) => {
    try {
      const res = await getLoginStatusService(cookie)
      console.log(res)
      // 筛选用户信息
      const { profile } = res.data
      setUserInfo(profile)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const logout = () => {
    user.value.cookie = ''
    user.value.userInfo = {}
    isLogin.value = false
  }
  return {
    user,
    isLogin,
    setCookie,
    logout
  }
}, {
  persist: {
    key: 'wyUser',
    storage: localStorage
  }
})
