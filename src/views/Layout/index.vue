<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import footerPlay from '@/components/footerPlay/foooterPlay.vue'
import { LeftOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useViewMsgStore,
  useWyUserStore,
  useKgUserStore,
  useSettingsStore,
  useAudioStore,
  useSpotifyUser
} from '@/stores'
import Slogin from '@/components/header/Slogin.vue'
import { computed } from '@vue/reactivity'
import Smenu from '@/components/menu/Smenu.vue'

import { getToken } from '@/api/spotify/user'
const wyUserStore = useWyUserStore()
const kgUserStore = useKgUserStore()
const settingsStore = useSettingsStore()
const viewMsgStore = useViewMsgStore() // 全局视图信息
const spotifyUser = useSpotifyUser() // spotify
const route = useRoute()
const router = useRouter()
const audioStore = useAudioStore()
const picture = ref('')
const selApiUser = computed(() => {
  switch (settingsStore.settings.apiSelect) {
    case 'wyy':
      picture.value = wyUserStore.user.userInfo?.avatarUrl
      return wyUserStore
    case 'kg':
      picture.value = kgUserStore.user.userInfo?.pic
      return kgUserStore
  }
  // return
})

const onCollapse = (collapsed, type) => {
  console.log(collapsed, type)
}
const onBreakpoint = (broken) => {
  console.log(broken)
}
const selectedKeys = ref([route.path])
const isShowMenu = ref(false)
watch(
  () => route.path,
  (newVal) => {
    // 判断路径如果 不是 recommended 就 设置
    if (newVal !== '/recommended') {
      console.log(newVal)
      console.log('非推荐页')
      viewMsgStore.isT = true
      isShowMenu.value = false
    } else {
      viewMsgStore.isT = false
      isShowMenu.value = true
    }
    selectedKeys.value = [newVal]
  },
  {
    immediate: true
  }
)
const isShowLogin = ref(false)
const login = () => {
  isShowLogin.value = !isShowLogin.value
}
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

const showPopup = ref(false)
onMounted(() => {
  if (!spotifyUser.user.token) {
    console.log('获取spotify token')
    getToken().then((res) => {
      console.log(res.data.access_token)
      spotifyUser.setToken(res.data.access_token)
    })
  }
})
</script>
<template>
  <a-layout class="layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      theme="light"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
      style="height: 100vh; background-color: #fff; margin-right: 40px"
      class="hidden lg:block"
    >
      <div class="logo b bg-white h-20">
        <div class="img-box">
          <img src="@/assets/logot.svg" alt="" />
        </div>
        在线音乐播放
      </div>
      <Smenu :isLogin="selApiUser.isLogin"></Smenu>
    </a-layout-sider>
    <a-layout>
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
      <var-app-bar v-if="viewMsgStore.device === 'mobile'" :title="viewMsgStore.cNavTitle">
        <template #left>
          <!-- 菜单 -->
          <var-menu v-if="isShowMenu">
            <var-button color="transparent" text-color="#fff" round text @click="showPopup = true">
              <var-icon name="menu" :size="24" />
            </var-button>
            <template #menu>
              <var-popup position="left" v-model:show="showPopup">
                <div class="popup-example-block">
                  <Smenu></Smenu>
                </div>
              </var-popup>
            </template>
          </var-menu>
          <!-- 返回 -->
          <var-button
            @click="$router.push('/recommended')"
            v-if="!isShowMenu"
            color="transparent"
            text-color="#fff"
            round
            text
          >
            <var-icon name="chevron-left" :size="24" />
          </var-button>
        </template>

        <template #right>
          <div class="r">
            <!-- 搜索 -->
            <var-button type="primary" round @click="$router.push('/search')">
              <var-icon name="magnify" />
            </var-button>
          </div>
        </template>
      </var-app-bar>
      <!-- 滚动容器 -->
      <div class="scroll">
        <!-- 内容 -->
        <a-layout-content>
          <div class="lg:pl-0 bg-white h-lvh">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>

  <!-- 底部 -->
  <footerPlay :device="viewMsgStore.device"></footerPlay>
  <Slogin :open="isShowLogin"></Slogin>
</template>
<style lang="scss" scoped>
// 侧边栏
.popup-example-block {
  padding: 24px;
  width: 280px;
}
.layout {
  min-height: 100vh;
  max-height: 100%;
  background-color: #fff;
  .r {
    &:deep(.var-button--round) {
      margin-right: 12px;
    }
  }
  .icon {
    font-size: 18px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 左边
    .l {
      display: flex;
      align-items: center;
      .icon {
        color: #ccc;
        font-size: 20px;
      }
    }
    // 右边
    .r {
      .icon {
        font-size: 20px;
      }
      display: flex;
      align-items: center;
      // 用户信息
      .inf {
        display: flex;
        align-items: center;
        .avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          overflow: hidden;
          border: 1px solid #8181;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .name {
          cursor: pointer;
        }
      }
      // 设置
      .set {
        margin: 0 40px;
      }
    }
  }
  .scroll {
    overflow-y: auto;
  }
  .c {
    background-color: rgba(152, 208, 242, 0.809);
  }
  .b {
    background-color: rgba(255, 255, 255, 0.809);
  }
  .logo {
    font-size: 18;
    font-family: 'myFont';
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid #000;
    // margin: 16px;
    .img-box {
      width: 32px;
      height: 32px;
      margin: 0 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
