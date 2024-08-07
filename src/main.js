import './assets/main.css'
import { Themes } from '@varlet/ui'

const viewportTheme = Themes.toViewport(Themes.md3Dark, {
    // 默认值为 375
    viewportWidth: 750,
    // 默认值为 'vmin'
    viewportUnit: 'vw',
    // 默认值为 6
    unitPrecision: 4,
})
import { createApp } from 'vue'
// pinia
import pinia from './stores'
// 图片懒加载
import lazy from '@/directives/lazy'
import App from './App.vue'
import router from './router'
const app = createApp(App)

// 注册图片懒加载指令
app.directive('myLazy', lazy)
app.use(pinia)
app.use(router)

app.mount('#app')
