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
        // 推荐
        {
          path: '/recommended',
          name: 'recommended',
          component: () => import('@/views/Recommended/index.vue')
        }

      ]
    }
  ]
})

export default router
