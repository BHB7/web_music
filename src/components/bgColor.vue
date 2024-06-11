<script setup>
// 导入必要的库和模块
// import * as PIXI from 'pixi.js'
import { onMounted, ref } from 'vue'
import ColorThief from 'colorthief'
import colorfulBackground from '@/utils/colorful.min.js'

// 动态导入 Web Worker
const worker = new Worker(new URL('../utils/worker.js', import.meta.url), {
  type: 'module'
})

// 定义组件的 props
const props = defineProps({
  img: {
    type: Object
  }
})

// 创建一个引用，用于 DOM 操作
const coverRef = ref()

onMounted(async () => {
  // 用于存储颜色的 ref
  const colorRgab = ref([])

  // 创建一个 Image 对象并设置跨域属性
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = props.img.currentSrc

  // 当图像加载完成后执行的回调函数
  img.onload = () => {
    // 使用 ColorThief 提取调色板
    const colorThief = new ColorThief()
    const colors = colorThief.getPalette(img)

    // 将颜色数据发送到 Web Worker 进行进一步处理
    worker.postMessage({ colors })

    // 监听 Web Worker 的消息
    worker.onmessage = function (event) {
      const { uniqueColors } = event.data
      // 更新颜色数组
      colorRgab.value = uniqueColors

      // 创建多彩背景
      colorfulBackground({
        container: coverRef.value,
        size: [window.innerWidth, window.innerHeight],
        animation: true,
        colors: colorRgab.value
      })

      // 创建 PIXI 应用程序
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        transparent: true,
        antialias: false,
        backgroundAlpha: 0
      })
      coverRef.value.appendChild(app.view)

      // 定义路径数组，用于绘制图像
      const paths = [
        'M125-51c0,0-72.5,150...-51z',
        'M505,...151.5z',
        'M1950,...132z',
        'M633....451z',
        'M-347.5....889.395z',
        'M12...102.931z'
      ]
      const canvas = document.createElement('canvas')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const context = canvas.getContext('2d')

      // 绘制路径
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const path2d = new Path2D(path)
        context.fillStyle = `rgba(0,0,0,${Math.random()})`
        context.filter = 'blur(10px)'
        context.fill(path2d)
      }

      // 创建 PIXI 纹理并应用到 Sprite 上
      const texture = PIXI.Texture.from(canvas)
      const displacementSprite = new PIXI.Sprite(texture)
      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
      app.stage.addChild(displacementSprite)

      // 应用位移滤镜
      const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)
      displacementFilter.padding = 10  // 添加一些 padding 以减少裁剪

      app.stage.filters = [displacementFilter]

      // 添加动画
      app.ticker.add(() => {
        displacementSprite.x += 1
        displacementSprite.y += 1
      })
    }
  }

  // 当图像加载失败时的回调函数
  img.onerror = (error) => {
    console.error('Failed to load image:', error)
  }
})
</script>

<template>
  <div class="cover" ref="coverRef"></div>
</template>

<style lang="scss" scoped>
.cover {
  transform: scale(1.5);
  z-index: -1;
  border: 1px solid #ffffff;
}
</style>
