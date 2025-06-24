<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LinkForm from '../components/LinkForm.vue'
import { useLinksStore } from '../stores/links'
import WhyUsSection from '@/components/WhyUsSection.vue'

const router = useRouter()
const linksStore = useLinksStore()

const createdLink = ref(null)
const showCreationSuccess = ref(false)

const handleLinkCreated = (link) => {
  createdLink.value = link
  showCreationSuccess.value = true
}

const copyToClipboard = async () => {
  if (!createdLink.value) return
  
  try {
    await navigator.clipboard.writeText(createdLink.value.short_url)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const createAnother = () => {
  createdLink.value = null
  showCreationSuccess.value = false
}
</script>

<template>
  <div class="py-10">
    <!-- Hero Section -->
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl animate-fade-in">
          <span class="block">Сокращайте ваши ссылки</span>
          <span class="block text-primary-600 dark:text-primary-400">Делитесь с уверенностью</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl animate-slide-up">
          Создавайте короткие, запоминающиеся ссылки, которые перенаправляют на ваши длинные URL. Отслеживайте клики и анализируйте эффективность ваших ссылок.
        </p>
      </div>
    </div>

    <!-- Form Section -->
    <div class="mt-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-slide-up">
        <div class="px-4 py-5 sm:p-6">
          <div v-if="showCreationSuccess" class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-300">Ссылка успешно создана!</h3>
                <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                  <div class="flex flex-wrap items-center">
                    <span class="mr-2">Ваша короткая ссылка:</span>
                    <a :href="createdLink.short_url" target="_blank" class="text-primary-600 dark:text-primary-400 font-medium">
                      {{ createdLink.short_url }}
                    </a>
                    <button 
                      @click="copyToClipboard" 
                      class="ml-2 inline-flex items-center p-1 border border-transparent rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="mt-3 flex">
                  <button @click="createAnother" class="btn btn-primary text-sm">
                    Создать ещё одну ссылку
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Создать короткую ссылку</h2>
            <div class="mt-3">
              <LinkForm @created="handleLinkCreated" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Us Section -->
    <WhyUsSection />
  
    <!-- Call to Action -->
    <div class="bg-primary-700 dark:bg-primary-900">
      <div class="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Готовы начать?</span>
          <span class="block">Зарегистрируйтесь бесплатно сегодня.</span>
        </h2>
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-md shadow">
            <router-link to="/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700">
              Бесплатная регистрация
            </router-link>
          </div>
          <div class="ml-3 inline-flex">
            <router-link to="/login" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 dark:bg-primary-800 dark:hover:bg-primary-700">
              Вход
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
</style> 