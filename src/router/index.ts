import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/LayoutComponents.vue'
import GameWall from '../views/tabView/GameView.vue'
import Rank from '../views/tabView/RankView.vue'
import Punishment from '../views/tabView/PunishmentView.vue'
import Profile from '../views/tabView/ProfileView.vue'
import LoginView from '../views/LoginView.vue'

import TempView from '../views/temp/TempView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/list',
    },
    // 以下是tab页面
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'list',
          name: 'list',
          component: GameWall,
          meta: { title: '桌游墙' },
        },
        {
          path: 'rank',
          name: 'rank',
          component: Rank,
          meta: { title: '排行榜' },
        },
        {
          path: 'punishment',
          name: 'punishment',
          component: Punishment,
          meta: { title: '惩罚' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
          meta: { title: '我的' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录' },
    },
    {
      path: '/test',
      name: 'test',
      component: TempView,
      meta: { title: '测试' },
    },
  ],
})

export default router
