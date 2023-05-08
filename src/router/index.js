import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录页面'
    },
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/',
    redirect: '/member'
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/member/index.vue')
  },
  {
    path: '/changeMember',
    name: 'ChangeMember',
    component: () => import('@/views/member/changeMember.vue')
  },
  {
    path: '/backend',
    name: 'Backend',
    component: () => import('@/views/backend/index.vue')
  },
  {
    path: '/jump',
    name: 'Jump',
    component: () => import('@/views/jump/index.vue')
  },
  {
    path: '/addJump',
    name: 'AddJump',
    component: () => import('@/views/jump/addJump.vue')
  },
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/views/notice/index.vue')
  },
  {
    path: '/addNotice',
    name: 'AddNotice',
    component: () => import('@/views/notice/addNotice.vue')
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   meta: {
  //     title: '404页面'
  //   },
  //   component: () => import('@/views/exception/404.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
