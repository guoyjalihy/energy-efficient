import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'step1',
    component: () => import(/* webpackChunkName: "about" */ '../views/step1.vue')
  },
  {
    path: '/step1',
    name: 'step1',
    component: () => import(/* webpackChunkName: "about" */ '../views/step1.vue')
  },
  {
    path: '/step2',
    name: 'step2',
    component: () => import(/* webpackChunkName: "about" */ '../views/step2.vue')
  },
  {
    path: '/step3',
    name: 'step3',
    component: () => import(/* webpackChunkName: "about" */ '../views/step3.vue')
  },
  {
    path: '/step4',
    name: 'step4',
    component: () => import(/* webpackChunkName: "about" */ '../views/step4.vue')
  },
  {
    path: '/step5',
    name: 'step5',
    component: () => import(/* webpackChunkName: "about" */ '../views/step5.vue')
  },
  {
    path: '/step6',
    name: 'step6',
    component: () => import(/* webpackChunkName: "about" */ '../views/step6.vue')
  },
  {
    path: '/step7',
    name: 'step7',
    component: () => import(/* webpackChunkName: "about" */ '../views/step7.vue')
  },
  {
    path: '/test',
    name: 'test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/test.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
