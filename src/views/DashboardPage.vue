<script setup>
import { ref, onMounted } from 'vue'
import { useLinksStore } from '../stores/links'
import LinkForm from '../components/LinkForm.vue'
import LinkItem from '../components/LinkItem.vue'

const linksStore = useLinksStore()
const showCreateForm = ref(false)
const isLoading = ref(true)
const links = ref([])
const userStats = ref(null)

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    fetchLinks(),
    fetchUserStats()
  ])
  isLoading.value = false
})

const fetchLinks = async () => {
  await linksStore.fetchLinks()
  links.value = linksStore.getLinks
}

const fetchUserStats = async () => {
  await linksStore.fetchUserStats()
  userStats.value = linksStore.getUserStats
}

const handleLinkCreated = (link) => {
  showCreateForm.value = false
  fetchUserStats()
  fetchLinks()
}

const handleLinkDeleted = () => {
  fetchUserStats()
  fetchLinks()
}
</script>

<template>
  <div class="py-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">Панель управления</h1>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <!-- Stats Section -->
      <div class="py-4">
        <div v-if="isLoading" class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
        
        <div v-else-if="userStats" class="mt-4">
          <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3 animate-fade-in">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Всего ссылок
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {{ userStats.total_links }}
                </dd>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Активные ссылки
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {{ userStats.active_links }}
                </dd>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Всего кликов
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {{ userStats.total_clicks }}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
      
      <!-- Create Link Button/Form Section -->
      <div v-if="!isLoading" class="py-4">
        <div v-if="!showCreateForm" class="flex justify-end">
          <button @click="showCreateForm = true" class="btn btn-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Создать новую ссылку
          </button>
        </div>
        <div v-else class="bg-white dark:bg-gray-800 shadow sm:rounded-lg animate-slide-up">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Создать новую короткую ссылку</h3>
            <div class="mt-5">
              <LinkForm @created="handleLinkCreated" />
            </div>
            <div class="mt-4 flex justify-end">
              <button @click="showCreateForm = false" class="btn btn-secondary">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Links Section -->
      <div class="py-4">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Ваши ссылки</h2>
        
        <div v-if="isLoading" class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div v-else-if="links.length === 0" class="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет ссылок</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Начните с создания новой ссылки.
          </p>
          <div class="mt-6">
            <button @click="showCreateForm = true" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Создать новую ссылку
            </button>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <LinkItem 
            v-for="link in links" 
            :key="link.id" 
            :link="link" 
            @deleted="handleLinkDeleted"
          />
        </div>
      </div>
    </div>
  </div>
</template> 