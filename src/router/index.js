import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/recommended',
      children: [
        // 设置
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@/views/Settings/index.vue')
        },
        // 推荐
        {
          path: '/recommended',
          name: 'recommended',
          component: () => import('@/views/Recommended/index.vue')
        },
        // 用户详情
        {
          path: '/userDetail',
          name: 'userDetail',
          component: () => import('@/views/UserDetail/index.vue')
        },
        // 我喜欢的音乐
        {
          path: '/likedSongs',
          name: 'likedSongs',
          component: () => import('@/views/LikedSongs/index.vue')
        },
        // 歌单详情展示
        {
          path: '/playlistDetail',
          name: 'playlistDetail',
          component: () => import('@/views/PlaylistDetail/index.vue')
        },
        {
          path: '/404',
          component: () => import('@/views/404/index.vue')
        }
      ]
    },
    // 404
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
    }
  ]
})

export default router
