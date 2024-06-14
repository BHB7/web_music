<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import footerPlay from '@/components/footerPlay/foooterPlay.vue'
import {
  SendOutlined,
  VideoCameraOutlined,
  LeftOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import SInput from '@/components/SInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { useWyUserStore } from '@/stores/index'
import Slogin from '@/components/header/Slogin.vue'

const wyUserStore = useWyUserStore()
const route = useRoute()
const router = useRouter()
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


onBeforeUnmount(() => {
  clearInterval(timer.value)
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
      style="height: 100vh; background-color: #f0f3f6; margin-right: 40px"
    >
      <div class="logo">
        <img src="@/assets/logo.svg" alt="" />
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="inline"
        style="background-color: #f0f3f6; margin-top: 10px"
      >
        <a-menu-item key="/recommended" @click="$router.push('/recommended')">
          <SendOutlined />
          <span class="nav-text">为你推荐</span>
        </a-menu-item>
        <a-menu-item-group title="我的">
          <a-menu-item key="/user">
            <video-camera-outlined />
            <span class="nav-text">nav 2</span>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header" :style="{ background: '#fff', padding: 0 }">
        <!-- 左侧 -->
        <div class="l">
          <!-- 返回 -->
          <LeftOutlined class="icon" @click="$router.go(-1)" />
          <SInput :width="'200px'" :height="'35px'" :placeholder="'搜索音乐'" />
        </div>
        <!-- 右侧 -->
        <div class="r">
          <!-- 未登录 -->
          <div class="inf" v-if="!wyUserStore.isLogin">
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
            <div class="avatar">
              <img :src="wyUserStore.user.userInfo.profile.avatarUrl" />
            </div>
            <!-- 昵称 -->
            <div class="name"><span>{{ wyUserStore.user.userInfo.profile.nickname }}</span></div>
          </div>
          <!-- 设置 -->
          <div class="set" @click="$router.push('/setting')">
            <SettingOutlined class="icon" />
          </div>
        </div>
      </a-layout-header>
      <!-- 内容 -->
      <a-layout-content>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '100vh' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <!-- 底部 -->
  <footerPlay></footerPlay>
  <Slogin :open="isShowLogin"></Slogin>
</template>
<style lang="scss" scoped>
.layout {
  background-color: #fff;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 左边
    .l {
      .icon {
        color: #ccc;
        font-size: 20px;
      }
      display: flex;
      align-items: center;
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
  .logo {
    // border: 1px solid #000;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .site-layout-sub-header-background {
    background: #fff;
  }

  .site-layout-background {
    background: #fff;
  }
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
