<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLinksStore } from '../stores/links'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const route = useRoute()
const router = useRouter()
const linksStore = useLinksStore()

const linkId = computed(() => Number(route.params.id))
const link = computed(() => linksStore.getCurrentLink)
const stats = computed(() => linksStore.getLinkStats)
const isLoading = ref(true)
const dateRange = ref('week')

const dateRangeOptions = [
  { value: 'week', label: 'Последние 7 дней' },
  { value: 'month', label: 'Последние 30 дней' },
  { value: 'year', label: 'За последний год' },
  { value: 'all', label: 'За всё время' }
]

// Calculate date range for API
const getDateRange = () => {
  const now = new Date()
  const from = new Date()
  
  switch (dateRange.value) {
    case 'week':
      from.setDate(now.getDate() - 7)
      break
    case 'month':
      from.setDate(now.getDate() - 30)
      break
    case 'year':
      from.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      return { from: null, to: null }
  }
  
  return {
    from: from.toISOString(),
    to: now.toISOString()
  }
}

const fetchData = async () => {
  isLoading.value = true
  
  try {
    // First fetch link details
    const linkData = await linksStore.fetchLink(linkId.value)
    
    if (!linkData) {
      router.push('/dashboard')
      return
    }
    
    // Then fetch stats with date range
    const { from, to } = getDateRange()
    await linksStore.fetchLinkStats(linkId.value, from, to)
  } catch (error) {
    console.error('Error fetching link stats:', error)
  } finally {
    isLoading.value = false
  }
}

const clicksByDateChartData = computed(() => {
  if (!stats.value?.clicks_by_date) {
    return { labels: [], datasets: [] }
  }
  
  // Sort dates in ascending order
  const sortedDates = Object.keys(stats.value.clicks_by_date).sort()
  
  return {
    labels: sortedDates.map(date => new Date(date).toLocaleDateString('ru-RU')),
    datasets: [
      {
        label: 'Клики',
        backgroundColor: '#38bdf8',
        data: sortedDates.map(date => stats.value.clicks_by_date[date])
      }
    ]
  }
})

const clicksByCountryChartData = computed(() => {
  if (!stats.value?.clicks_by_country) {
    return { labels: [], datasets: [] }
  }
  
  const countries = Object.keys(stats.value.clicks_by_country)
  
  // Generate random colors for each country
  const backgroundColors = countries.map(() => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `rgba(${r}, ${g}, ${b}, 0.6)`
  })
  
  return {
    labels: countries,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: countries.map(country => stats.value.clicks_by_country[country])
      }
    ]
  }
})

const clicksByDeviceChartData = computed(() => {
  if (!stats.value?.clicks_by_device) {
    return { labels: [], datasets: [] }
  }
  
  const devices = Object.keys(stats.value.clicks_by_device)
  
  return {
    labels: devices,
    datasets: [
      {
        backgroundColor: ['#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc'],
        data: devices.map(device => stats.value.clicks_by_device[device])
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: 'white',
  plugins: {
    legend: {
      labels: {
        color: 'rgb(156 163 175)' // text-gray-400
      }
    }
  },
  scales: {
    x: {
      ticks: { color: 'rgb(156 163 175)' },
      grid: { color: 'rgba(156, 163, 175, 0.1)' }
    },
    y: {
      ticks: { color: 'rgb(156 163 175)' },
      grid: { color: 'rgba(156, 163, 175, 0.1)' }
    }
  }
}

const updateDateRange = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="py-6">
    <!-- Header with back button -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
      <button @click="router.push('/dashboard')" class="mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">Статистика ссылки</h1>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div v-if="isLoading" class="animate-pulse space-y-4">
        <div class="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div v-else-if="link && stats" class="space-y-8">
        <!-- Link Summary -->
        <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg animate-fade-in">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Информация о ссылке
            </h3>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Оригинальный URL</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2 break-words">
                  {{ link.original_url }}
                </dd>
              </div>
              <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Короткий URL</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2 flex items-center">
                  <a :href="link.short_url" target="_blank" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                    {{ link.short_url }}
                  </a>
                </dd>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Создано</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  {{ new Date(link.created_at).toLocaleString('ru-RU') }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <!-- Date Range Selector -->
        <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Статистика кликов
            </h3>
            <div class="inline-flex rounded-md">
              <select 
                v-model="dateRange" 
                @change="updateDateRange" 
                class="input rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option 
                  v-for="option in dateRangeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Stats Summary -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 animate-fade-in">
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Всего кликов</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ stats.total_clicks }}</dd>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Уникальные клики</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ stats.unique_clicks }}</dd>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Конверсия</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ stats.unique_clicks > 0 ? Math.round((stats.unique_clicks / stats.total_clicks) * 100) : 0 }}%
              </dd>
            </div>
          </div>
        </div>
        
        <!-- Charts Section -->
        <div class="space-y-8">
          <!-- Clicks by Date -->
          <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Клики по дням
            </h3>
            <div class="h-64">
              <Bar v-if="clicksByDateChartData.labels.length > 0" :data="clicksByDateChartData" :options="chartOptions" />
              <div v-else class="flex h-full items-center justify-center">
                <p class="text-gray-500 dark:text-gray-400">Нет данных для отображения</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <!-- Clicks by Country -->
            <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Клики по странам
              </h3>
              <div class="h-64">
                <Pie v-if="clicksByCountryChartData.labels.length > 0" :data="clicksByCountryChartData" :options="chartOptions" />
                <div v-else class="flex h-full items-center justify-center">
                  <p class="text-gray-500 dark:text-gray-400">Нет данных для отображения</p>
                </div>
              </div>
            </div>
            
            <!-- Clicks by Device -->
            <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Клики по устройствам
              </h3>
              <div class="h-64">
                <Pie v-if="clicksByDeviceChartData.labels.length > 0" :data="clicksByDeviceChartData" :options="chartOptions" />
                <div v-else class="flex h-full items-center justify-center">
                  <p class="text-gray-500 dark:text-gray-400">Нет данных для отображения</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No statistics found</h3>
        <p class="mt-1 text-gray-500">
          We couldn't find statistics for this link. It may have been deleted or you may not have permission to view it.
        </p>
        <div class="mt-6">
          <button @click="router.push('/dashboard')" class="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 