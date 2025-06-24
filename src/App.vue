<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import ThemeToggle from './components/ThemeToggle.vue'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const navLinks = [
  { name: 'Главная', route: 'home' },
  { name: 'Панель управления', route: 'dashboard', auth: true }
]

const linksToShow = computed(() => navLinks.filter(l => !l.auth || isAuthenticated.value))

watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    if (router.currentRoute.value.name === 'login' || router.currentRoute.value.name === 'register') {
      router.push('/dashboard')
    }
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
    <nav class="w-full bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between h-16 items-center px-4">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-xl font-bold text-primary-600 dark:text-primary-400">СокращательСсылок</router-link>
            <div class="hidden sm:flex space-x-4">
              <router-link 
                v-for="link in linksToShow" 
                :key="link.route" 
                :to="{ name: link.route }" 
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="$route.name === link.route ? 'border-primary-500 text-gray-900 dark:text-gray-100' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'">
                {{ link.name }}
              </router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <div v-if="isAuthenticated" class="hidden sm:flex items-center space-x-4">
              <router-link to="/profile" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">Профиль</router-link>
              <button @click="logout" class="btn btn-secondary">Выйти</button>
            </div>
            <div v-else class="hidden sm:flex items-center space-x-4">
              <router-link to="/login" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">Вход</router-link>
              <router-link to="/register" class="btn btn-primary">Регистрация</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="flex-1 w-full">
      <div class="max-w-6xl mx-auto py-6 px-4">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <footer class="w-full bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="max-w-6xl mx-auto py-4 px-4">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} СокращательСсылок. Все права защищены.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
