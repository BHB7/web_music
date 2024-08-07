import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewMsgStore = defineStore('viewMsg', () => {
    const cNavTitle = ref('') // c端导航栏标题

    const device = ref('') // 设备类型 mobile | pc

    const isT = ref(false)

    // 搜索历史记录
    const searchHistory = ref([])
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

    // c 端 单条歌词设置
    const lyric = ref('')

    const setLyric = (newLyric) => {
        lyric.value = newLyric
    }

    // 设置设备类型
    const setDevice = (newDevice) => {
        device.value = newDevice
    }
    // 
    const setT = (newT) => {
        isT.value = newT
    }
    // 设置搜索历史记录
    const setSearchHistory = (newSearchHistory) => {
        console.log(newSearchHistory)
        searchHistory.value = newSearchHistory
    }

    // 添加搜索历史记录
    const addSearchHistory = (newSearchHistory) => {
        searchHistory.value.unshift(newSearchHistory)
    }

    return {
        isT,
        setT,
        lyric,
        setLyric,
        cNavTitle,
        setCNavTitle,
        searchHistory,
        setSearchHistory,
        addSearchHistory,
        device,
        setDevice,
        playListDetailIsLoaded,
        setPlayListDetailIsLoaded,
        likePlayListIsLoaded,
        setLikePlayListIsLoaded
    }
}, {
    persist: true,
    persist: {
        storage: sessionStorage,
        paths: ['searchHistory']
    }
})