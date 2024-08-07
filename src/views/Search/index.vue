<script setup>
import { useSpotifyUser } from '@/stores'
import { search } from '@/api/spotify/song'
import { search as kwSearch, getHotSearch } from '@/api/kw/song'
import { useViewMsgStore } from '@/stores'
import { ref } from 'vue'
import songListTabel from '@/components/songList/songListTabel.vue'
import axios from 'axios'
const viewMsgStore = useViewMsgStore() // 全局视图信息
viewMsgStore.setCNavTitle('搜索')
const { user } = useSpotifyUser()

console.log(user.token)
// 判断设备
const isMobile = () => {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  if (flag) {
    viewMsgStore.setDevice('mobile') // 设置设备类型为移动设备
    console.log('移动端设备')
  } else {
    viewMsgStore.setDevice('pc') // 设置设备类型为pc设备
    console.log('pc设备')
  }
}
isMobile()
// 当视口发生变化时触发
const timer = ref(null)
window.onresize = () => {
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    isMobile()
  }, 500)
}

// kwSearch('林俊杰', 1, 20).then((res) => {
//   // 将字符串中的单引号替换为双引号 方便解析json
//   const dataStr = res.data.replace(/\'/g, '"')
//   // 将字符串解析为json
//   const data = JSON.parse(dataStr)
//   console.log(data)
//   const list = data.abslist.map((item) => {
//     /**
//      *             { al:{ picUrl: '', id: 0, name: '专辑名', }, name: '歌曲名', ar: [ { name: '歌手名', id:
//             0, }, ], }
//      */

//     return {
//       al: {
//         picUrl: item.web_albumpic_short
//           ? 'https://img2.kuwo.cn/star/albumcover/'.concat(item.web_albumpic_short)
//           : item.web_artistpic_short
//             ? 'https://img1.kuwo.cn/star/starheads/'.concat(item.web_artistpic_short)
//             : '',
//         id: item.DC_TARGETID,
//         name: item.NAME
//       },
//       name: item.SONGNAME,
//       ar: [{ name: item.ARTIST, id: 0 }]
//     }
//   })
//   console.log(list)
// })
const showList = ref(false)
const scValue = ref('')
const playList = ref({})
const loading = ref(false)
const onSearch = (value) => {
  if (!value) return
  // viewMsgStore.setPlayListDetailIsLoaded(false) // 显示加载
  loading.value = true
  kwSearch(value.trim(''), 0, 1000).then((res) => {
    showList.value = true
    // viewMsgStore.setPlayListDetailIsLoaded(true) // 隐藏加载
    loading.value = false
    const data = res.data
    if (typeof res.data === 'string') {
      // 将字符串中的单引号替换为双引号 方便解析json
      const dataStr = res.data.replace(/\'/g, '"')

      // 将字符串解析为json
      data = JSON.parse(dataStr.replace(/\&nbsp;/g, ' ').replace(/\&/g, ' / '))
    }
    console.log(data.abslist)
    const list = data.abslist.map((item) => {
      /**
     *             { al:{ picUrl: '', id: 0, name: '专辑名', }, name: '歌曲名', ar: [ { name: '歌手名', id:
            0, }, ], }
     */

      return {
        al: {
          picUrl: item.web_albumpic_short
            ? 'https://img1.kuwo.cn/star/albumcover/'.concat(item.web_albumpic_short)
            : item.web_artistpic_short
              ? 'https://img1.kuwo.cn/star/starheads/'.concat(item.web_artistpic_short)
              : '',
          id: item.DC_TARGETID,
          name: item.NAME
        },
        name: item.SONGNAME,
        ar: [{ name: item.ARTIST, id: 0 }],
        dt: '00:00'
      }
    })
    playList.value.songs = list
  })
}

const showChip = ref(true)
// 获取热门搜索
const hotList = ref([])
const hotSearch = () => {
  getHotSearch().then((res) => {
    console.log(res)
    hotList.value = res.data.data
  })
}
hotSearch()

// 点击热门搜索
const hotScH = (item) => {
  viewMsgStore.addSearchHistory({ name: item, id: +new Date().getTime() })
  scValue.value = item
  onSearch(item)
}
// 清空搜索框
const clear = () => {
  scValue.value = ''
  showList.value = false
}
// 删除搜索历史
const clearSH = (id) => {
  console.log(id)
  viewMsgStore.setSearchHistory(viewMsgStore.searchHistory.filter((item) => item.id !== id))
}
</script>
<template>
  <!-- pc头部 -->
  <a-layout-header
    v-if="viewMsgStore.device === 'pc'"
    class="header"
    :style="{ background: '#fff', padding: 0 }"
  >
    <!-- 左侧 -->
    <div class="l flex">
      <!-- 返回 -->
      <LeftOutlined class="icon lg:block hidden" @click="$router.go(-1)" />
    </div>
    <!-- 右侧 -->
    <div class="r">
      <!-- 未登录 -->
      <div class="inf" v-if="!selApiUser.isLogin">
        <!-- 头像 -->
        <div class="avatar">
          <img src="https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg" />
        </div>
        <!-- 昵称 -->
        <div class="name lg:mr-0 mr-8" @click="login"><span>未登录</span></div>
      </div>
      <!-- 登录 用户信息 -->
      <div class="inf" v-else>
        <!-- 头像 -->
        <div class="avatar" @click="$router.push(`/userDetail`)">
          <img :src="picture" />
        </div>
        <!-- 昵称 -->
        <div class="name lg:mr-0 mr-5">
          <span>{{ selApiUser.user.userInfo?.nickname }}</span>
        </div>
      </div>
      <!-- 设置 -->
      <div class="set lg:block hidden" @click="$router.push('/setting')">
        <SettingOutlined class="icon" />
      </div>
    </div>
  </a-layout-header>
  <!-- 移动端头部 -->
  <var-app-bar v-if="viewMsgStore.device === 'mobile'">
    <template #left>
      <!-- 返回 -->
      <var-button
        @click="$router.push('/recommended')"
        color="transparent"
        text-color="#fff"
        round
        text
      >
        <var-icon name="chevron-left" :size="24" />
      </var-button>
    </template>

    <!-- 搜索 -->
    <template #content>
      <input type="text" class="ipt" v-model="scValue" placeholder="搜索音乐" />
      <span v-if="scValue" @click="clear" class="clear"><var-icon name="window-close" /></span>
    </template>
    <template #right>
      <var-button text @click="onSearch(scValue)"> 搜索 </var-button>
    </template>
  </var-app-bar>
  <!-- 搜索结果 -->
  <var-loading description="LOADING" :loading="loading">
    <div class="play-list" v-if="showList">
      <songListTabel :list="playList" type="kw" :art="0"></songListTabel>
    </div>

    <div v-else>
      <!-- 热门搜索 -->
      <div class="history">
        <div class="title">热门搜索</div>
        <var-space>
          <var-chip v-for="(item, index) in hotList" @click="hotScH(item)">{{ item }}</var-chip>
        </var-space>
      </div>

      <!-- 历史搜索 -->
      <div class="history">
        <div class="title">历史搜索</div>
        <var-space>
          <var-chip
            v-for="(item, index) in viewMsgStore.searchHistory || 0"
            closeable
            v-if="showChip"
            @close="clearSH(item.id)"
            >{{ item.name }}</var-chip
          >
        </var-space>
      </div>
    </div>
  </var-loading>
</template>

<style lang="scss" scoped>
.play-list {
  height: 100vh;
  overflow: auto;
}
.history {
  margin: 10px 0;
  padding: 0 10px;
  .title {
    margin: 10px 0;
    font-size: 16px;
    font-weight: 600;
  }
}
.ipt {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 38px;
  width: 270px;
  position: absolute;
  border-radius: 15px;
  color: black;
  outline: none;
  font-size: large;
  padding: 0 10px;
}
.clear {
  position: absolute;
  right: 90px;
  top: 50%;
  color: black;
  transform: translateY(-50%);
}
</style>
