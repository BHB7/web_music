import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKgUserStore = defineStore('kgUser', () => {
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
            isLogin.value = true
        } else {
            console.error('user.value is undefined')
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
        setUserInfo,
        logout
    }
}, {
    persist: {
        key: 'kgUser',
        storage: localStorage
    }
}

)