// worker.js

self.onmessage = function (event) {
  const { colors } = event.data

  // 在 worker 中处理其他计算任务
  const uniqueColors = new Set()
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i]
    uniqueColors.add(`rgba(${color[0]},${color[1]},${color[2]}, 1)`)
  }

  // 将结果发送回主线程
  self.postMessage({ uniqueColors: Array.from(uniqueColors) })
}
