import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useSettingsStore = defineStore('settings', () => {

    const settings = ref({
        theme: 'light', // 主题
        apiSelect: 'wyy', // 请求接口
    })

    // 设置api选项
    const setApiSelect = (val) => {
        settings.value.apiSelect = val
    }


    return {
        settings,
        setApiSelect
    }

})