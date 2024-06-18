import './assets/main.css'

import { createApp } from 'vue'
// pinia
import pinia from './stores'
// 图片懒加载
import lazy from '@/directives/lazy'
import App from './App.vue'
import router from './router'
const app = createApp(App)

// 注册图片懒加载指令
app.directive('lazy', lazy)
app.use(pinia)
app.use(router)

app.mount('#app')
