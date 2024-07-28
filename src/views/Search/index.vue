<script setup>
import { useSpotifyUser } from '@/stores'
import { search } from '@/api/spotify/song'
import { search as kwSearch } from '@/api/kw/song'
import { useViewMsgStore } from '@/stores'
import { ref } from 'vue'
import songListTabel from '@/components/songList/songListTabel.vue'
import axios from 'axios'
const viewMsgTitleStore = useViewMsgStore() // 全局视图信息
viewMsgTitleStore.setCNavTitle('搜索')
const { user } = useSpotifyUser()

console.log(user.token)

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

const value = ref('')
const playList = ref({})
const onSearch = (value) => {
  if (!value) return
  kwSearch(value.trim(''), 1, 20).then((res) => {
    // 将字符串中的单引号替换为双引号 方便解析json
    const dataStr = res.data.replace(/\'/g, '"')
    // 将字符串解析为json
    const data = JSON.parse(dataStr)
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
</script>
<template>
  <div class="ipt">
    <a-input-search
      v-model:value="value"
      placeholder="input search text"
      enter-button
      @search="onSearch"
    />
  </div>
  <div class="play-list">
    <songListTabel :list="playList" type="kw" :art="0"></songListTabel>
  </div>
</template>

<style lang="scss" scoped>
.ipt {
  width: 200px;
}
</style>
