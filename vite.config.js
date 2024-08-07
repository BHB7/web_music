import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
// https://vitejs.dev/config/
export default defineConfig({
  // 根路径 默认使用/ vue cli 3.3+ 弃用 baseUrl
  publicPath: '/', // 此处改为 './' 即可
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        }),
        VarletImportResolver()
      ]
    })
    ,
    autoImport({
      resolvers: [VarletImportResolver({ autoImport: true })]
    }),
    // 解决props响应式问题
    ReactivityTransform(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/kws': {
        target: 'https://search.kuwo.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kws/, '')
      }
    }
  }
})