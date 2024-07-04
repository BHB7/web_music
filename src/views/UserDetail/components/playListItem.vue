<script setup>
import { CaretRightOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
const btnRef = ref(null)
const hover = () => {
  gsap.to(btnRef.value, {
    opacity: 1,
    scale: 1.1,
    duration: 0.5,
    ease: 'power1.out'
  })
}
const leave = () => {
  gsap.to(btnRef.value, {
    opacity: 0,
    scale: 1,
    duration: 0.5,
    ease: 'power1.in'
  })
}
const isShowPlayListBtn = ref(false)
</script>

<template>
  <div class="playList-item" @mouseenter="hover" @mouseleave="leave">
    <div class="header">
      <CaretRightOutlined class="icon" />
      <!-- 播放量 -->
      <span>{{ item.playCount }}</span>
    </div>
    <div class="content">
      <!-- 歌单封面图 -->
      <div class="cover">
        <img :src="item.coverImgUrl" alt="" />
      </div>
      <!-- 按钮 -->
      <div class="btn" ref="btnRef">
        <a>
          <button>
            <i class="icon iconfont icon-applemusicicon_07"></i>
          </button>
        </a>
      </div>
    </div>
    <div class="footer">
      <div class="title">{{ item.name }}</div>
      <div class="desc">{{ item.trackCount }} 首</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playList-item {
  width: 200px;
  cursor: pointer;
  user-select: none;
  position: relative;
  .header {
    padding: 0 6px;
    height: 30px;
    position: absolute;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 20px;
    color: #fff;
    z-index: 1;
    font-size: 18px;
    font-weight: 700;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    .icon {
      color: #fff;
    }
  }
  .content {
    overflow: hidden;
    border-radius: 14px;
    width: 100%;
    height: 180px;
    position: relative;
    .cover {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        // 使用图片滤镜 压暗背景
        // filter: brightness(0.7);
      }
    }
    .btn {
      opacity: 0;
      position: absolute;
      bottom: 20px;
      right: 20px;
      a {
        margin: 0;
        .icon {
          color: #000;
        }
        button {
          margin: 0;
          padding: 8px;
          border: none;
          outline: none;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }
  .footer {
    width: 100%;
    div {
      padding: 0 10px;
      padding-top: 4px;
    }
    .title {
      color: #283248;
      font-size: 15px;
      font-weight: 700;
    }
    .desc {
      font-size: 14px;
      color: #7e8491;
    }
  }
  &:hover {
  }
}
</style>
