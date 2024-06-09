<script setup>
import { ref } from 'vue'
import footerPlay from '@/components/footerPlay/foooterPlay.vue'
import { SendOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'
const onCollapse = (collapsed, type) => {
  console.log(collapsed, type)
}
const onBreakpoint = (broken) => {
  console.log(broken)
}
const selectedKeys = ref(['4'])
</script>
<template>
  <a-layout>
    <a-layout-sider
      theme="light"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
      style="height: 100vh; background-color: #f0f3f6"
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
        <a-menu-item key="1">
          <SendOutlined />
          <span class="nav-text">为你推荐</span>
        </a-menu-item>
        <a-menu-item-group title="我的">
          <a-menu-item key="2">
            <video-camera-outlined />
            <span class="nav-text">nav 2</span>
          </a-menu-item>
          <a-menu-item key="3">
            <upload-outlined />
            <span class="nav-text">nav 3</span>
          </a-menu-item>
          <a-menu-item key="4">
            <user-outlined />
            <span class="nav-text">nav 4</span>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 0 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '100vh' }"
        >
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <!-- 底部 -->
  <footerPlay></footerPlay>
</template>
<style lang="scss" scoped>
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

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
