import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth-callback" */ '@/views/Auth')
  },
  {
    path: '/auth-callback',
    name: 'AuthCallback',
    component: () => import(/* webpackChunkName: "auth-callback" */ '@/views/AuthCallback.vue')
  },
  {
    path: '/app',
    name: 'Albums',
    component: () => import(/* webpackChunkName: "disco-list" */ '@/views/Drawer.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
