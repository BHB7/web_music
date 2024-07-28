import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotifyUser = defineStore('spotifyUser', () => {
    const user = ref({
        token: '',
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

    const setToken = (token) => {
        if (user.value) {
            user.value.token = token
            getUserInfo(token)
            isLogin.value = true
        } else {
            console.error('user.value is undefined')
        }
    }

    const getUserInfo = async (token) => {
        console.log('获取用户信息')
    }

    const logout = () => {
        user.value.token = ''
        user.value.userInfo = {}
        isLogin.value = false
    }
    return {
        user,
        isLogin,
        setToken,
        logout
    }
}, {
    persist: {
        key: 'spotifyUser',
        storage: localStorage
    }
})
