import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7c069a68 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _9b0ef4de = () => interopDefault(import('../pages/admin/index.vue' /* webpackChunkName: "pages/admin/index" */))
const _a9479eb0 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _1b934734 = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _859a1906 = () => interopDefault(import('../pages/admin/episode/index.vue' /* webpackChunkName: "pages/admin/episode/index" */))
const _fa1c9db6 = () => interopDefault(import('../pages/admin/episode/_id.vue' /* webpackChunkName: "pages/admin/episode/_id" */))
const _3c96e4de = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _7c069a68,
    name: "about"
  }, {
    path: "/admin",
    component: _9b0ef4de,
    name: "admin"
  }, {
    path: "/login",
    component: _a9479eb0,
    name: "login"
  }, {
    path: "/register",
    component: _1b934734,
    name: "register"
  }, {
    path: "/admin/episode",
    component: _859a1906,
    name: "admin-episode"
  }, {
    path: "/admin/episode/:id",
    component: _fa1c9db6,
    name: "admin-episode-id"
  }, {
    path: "/",
    component: _3c96e4de,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
