import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewMsgStore = defineStore('viewMsg', () => {
    const cNavTitle = ref('')

    const setCNavTitle = (newTitle) => {
        // console.log(newTitle)
        cNavTitle.value = newTitle
    }

    return {
        cNavTitle,
        setCNavTitle
    }
})