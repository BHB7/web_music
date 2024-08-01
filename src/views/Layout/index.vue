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
watch(
  () => route.path,
  (newVal) => {
    selectedKeys.value = [newVal]
  }
)
const isShowLogin = ref(false)
const login = () => {
  isShowLogin.value = !isShowLogin.value
}
const openDrawer = ref(false)
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
// 判断设备
const isMobile = () => {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return flag
}

onMounted(() => {
  if (isMobile()) {
    viewMsgStore.setDevice('mobile') // 设置设备类型为移动设备
    console.log('移动端设备')
  } else {
    viewMsgStore.setDevice('pc') // 设置设备类型为pc设备
    console.log('pc设备')
  }

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
  <a-drawer
    :closable="false"
    :bodyStyle="{ padding: '0px' }"
    v-model:open="openDrawer"
    class="layout"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    placement="left"
    :width="'60%'"
    @close="openDrawer = false"
  >
    <div class="logo c h-32">
      <div class="img-box">
        <img src="@/assets/logot.svg" alt="" />
      </div>
      在线音乐播放
    </div>
    <Smenu :isLogin="selApiUser.isLogin"></Smenu>
  </a-drawer>
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
      <!-- 头部 -->
      <a-layout-header class="header" :style="{ background: '#fff', padding: 0 }">
        <!-- 左侧 -->
        <div class="l flex">
          <!-- 返回 -->
          <LeftOutlined class="icon lg:block hidden" @click="$router.go(-1)" />
          <!-- 移动端侧边栏激发按钮 -->
          <MenuOutlined
            @click="openDrawer = true"
            class="lg:hidden text-blue ml-4"
            style="font-size: 1.6rem"
          />
          <!-- 移动端标题显示位置 -->
          <span class="ctitlt lg:hidden mx-4 font-bold text-sm">{{ viewMsgStore.cNavTitle }}</span>
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
      <!-- 滚动容器 -->
      <div class="scroll">
        <!-- 内容 -->
        <a-layout-content>
          <div class="lg:pl-0 bg-white pl-4 h-lvh">
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
.layout {
  min-height: 100vh;
  max-height: 100%;
  background-color: #fff;

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
