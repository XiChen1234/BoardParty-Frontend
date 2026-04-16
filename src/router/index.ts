import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/LayoutComponents.vue'
import GameWall from '../views/GameView.vue'
import GameDetail from '../components/Game/GameDetailView.vue'
import Rank from '../views/RankView.vue'
import Punishment from '../views/PunishmentView.vue'
import Profile from '../views/ProfileView.vue'

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
        // 以下是非tab页面
        {
          path: 'game/:id',
          name: 'game-detail',
          component: GameDetail,
          meta: { title: '游戏详情' },
        },
      ],
    },
  ],
})

export default router
