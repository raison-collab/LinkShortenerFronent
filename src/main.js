import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useThemeStore } from './stores/theme'
import { setupAxiosInterceptors } from './api/axios'

const Home = () => import('./views/HomePage.vue')
const Login = () => import('./views/LoginPage.vue')
const Register = () => import('./views/RegisterPage.vue')
const Dashboard = () => import('./views/DashboardPage.vue')
const Profile = () => import('./views/ProfilePage.vue')
const LinkStats = () => import('./views/LinkStatsPage.vue')
const NotFound = () => import('./views/NotFoundPage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { 
      path: '/dashboard', 
      component: Dashboard, 
      name: 'dashboard',
      meta: { requiresAuth: true }
    },
    { 
      path: '/profile', 
      component: Profile, 
      name: 'profile',
      meta: { requiresAuth: true }
    },
    { 
      path: '/links/:id/stats', 
      component: LinkStats, 
      name: 'link-stats',
      meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', component: NotFound, name: 'not-found' }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

router.beforeResolve(async (to, from, next) => {
  try {
    await to.matched.forEach(record => {
      const component = record.components.default
      if (typeof component === 'function' && !component.__vccOpts) {
        component()
      }
    })
  } catch (error) {
    console.error('Error loading route component:', error)
  }
  next()
})

setupAxiosInterceptors(router);

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')
