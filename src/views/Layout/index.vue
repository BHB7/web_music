<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import footerPlay from '@/components/footerPlay/foooterPlay.vue'
import {
  SendOutlined,
  HeartOutlined,
  LeftOutlined,
  SettingOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import SInput from '@/components/SInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { useWyUserStore, useKgUserStore, useSettingsStore, useAudioStore } from '@/stores'
import Slogin from '@/components/header/Slogin.vue'
import { computed } from '@vue/reactivity'
import Smenu from '@/components/menu/Smenu.vue'
const wyUserStore = useWyUserStore()
const kgUserStore = useKgUserStore()
const settingsStore = useSettingsStore()
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
    @after-open-change="afterOpenChange"
  >
    <div class="logo">
      <div class="img-box">
        <img src="@/assets/logot.svg" alt="" />
      </div>
      在线音乐播放
    </div>
    <Smenu></Smenu>
  </a-drawer>
  <a-layout class="layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      theme="light"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
      style="height: 100vh; background-color: #f0f3f6; margin-right: 40px"
      class="hidden lg:block"
    >
      <div class="logo">
        <div class="img-box">
          <img src="@/assets/logot.svg" alt="" />
        </div>
        在线音乐播放
      </div>
      <Smenu></Smenu>
    </a-layout-sider>
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header" :style="{ background: '#fff', padding: 0 }">
        <!-- 左侧 -->
        <div class="l flex flex-col md:flex-row">
          <!-- 返回 -->
          <LeftOutlined class="icon lg:block hidden" @click="$router.go(-1)" />
          <!-- 移动端侧边栏激发按钮 -->
          <UnorderedListOutlined
            @click="openDrawer = true"
            class="lg:hidden text-blue ml-4"
            style="font-size: 1.6rem"
          />
          <SInput :width="'200px'" :height="'35px'" :placeholder="'搜索音乐'" />
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
            <div class="name" @click="login"><span>未登录</span></div>
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
          <div :style="{ padding: '24px', background: '#fff', minHeight: '100vh' }">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>
  <!-- 底部 -->
  <footerPlay></footerPlay>
  <Slogin :open="isShowLogin"></Slogin>
</template>
<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  max-height: 100%;
  background-color: #fff;
  // 样式穿透
  // 选中菜单状态
  &:deep(.ant-menu .ant-menu-item-selected) {
    color: #fff;
    background-color: dodgerblue;
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
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid #000;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    // margin: 16px;
    margin: 20px 0;
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
