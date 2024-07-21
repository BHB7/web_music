import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewMsgStore = defineStore('viewMsg', () => {
    const cNavTitle = ref('') // c端导航栏标题

    // 歌单详情页数据是否加载
    const playListDetailIsLoaded = ref(true)

    // 喜欢歌单是否加载
    const likePlayListIsLoaded = ref(false)
    // 设置导航栏标题
    const setCNavTitle = (newTitle) => {
        // console.log(newTitle)
        cNavTitle.value = newTitle
    }

    // 设置歌单详情页数据是否加载
    const setPlayListDetailIsLoaded = (newValue) => {
        playListDetailIsLoaded.value = newValue
    }
    // 设置喜欢歌单是否加载
    const setLikePlayListIsLoaded = (newValue) => {
        console.log('设置喜欢歌单信息')
        likePlayListIsLoaded.value = newValue
    }


    return {
        cNavTitle,
        setCNavTitle,
        playListDetailIsLoaded,
        setPlayListDetailIsLoaded,
        likePlayListIsLoaded,
        setLikePlayListIsLoaded
    }
})