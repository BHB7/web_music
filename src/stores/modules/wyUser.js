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
      setUserInfo(res.data)
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

  return {
    user,
    isLogin,
    setCookie
  }
}, {
  persist: {
    key: 'wyUser',
    storage: localStorage
  }
})
