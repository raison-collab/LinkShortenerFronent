<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 animate-fade-in">
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-primary-600 sm:text-5xl">409</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-5xl">Срок действия ссылки истёк</h1>
            <p class="mt-1 text-base text-gray-500 dark:text-gray-400">Запрашиваемая ссылка более недоступна. Создайте новую или обратитесь к владельцу ссылки.</p>
          </div>
          <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <router-link to="/" class="btn btn-primary">
              На главную
            </router-link>
            <router-link to="/dashboard" class="btn btn-secondary" v-if="localStorage.getItem('auth_token')">
              Панель управления
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template> 