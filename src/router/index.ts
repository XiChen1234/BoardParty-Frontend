import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/LayoutComponents.vue'
import GameWall from '../views/tabView/GameView.vue'
import Rank from '../views/tabView/RankView.vue'
import Group from '../views/tabView/GroupView.vue'
import Profile from '../views/tabView/ProfileView.vue'
import GroupDetailView from '../views/GroupDetailView.vue'
import PunishmentView from '../views/PunishmentView.vue'
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
          meta: { title: '桌游' },
        },
        {
          path: 'rank',
          name: 'rank',
          component: Rank,
          meta: { title: '排行' },
        },
        {
          path: 'group',
          name: 'group',
          component: Group,
          meta: { title: '小圈' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
          meta: { title: '我的' },
        },
        // 以下是不带tab的页面
        {
          path: 'punishment',
          name: 'punishment',
          component: PunishmentView,
          meta: { title: '惩罚' },
        },
        {
          path: 'group/:id',
          name: 'group-detail',
          component: GroupDetailView,
          meta: { title: '小圈详情' },
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
