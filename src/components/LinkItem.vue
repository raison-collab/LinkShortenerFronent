<script setup>
import { ref, computed } from 'vue'
import { useLinksStore } from '../stores/links'
import { useRouter } from 'vue-router'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['deleted'])

const linksStore = useLinksStore()
const router = useRouter()

const copied = ref(false)
const showConfirmDelete = ref(false)
const isDeleting = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return 'Никогда'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const isLinkActive = computed(() => {
  if (props.link.is_active !== undefined) {
    return props.link.is_active
  }
  
  if (!props.link.expires_at) {
    return true
  }
  
  return new Date(props.link.expires_at) > new Date()
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link.short_url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const viewStats = () => {
  router.push({ name: 'link-stats', params: { id: props.link.id } })
}

const deleteLink = async () => {
  isDeleting.value = true
  const success = await linksStore.deleteLink(props.link.id)
  if (success) {
    emit('deleted', props.link.id)
  }
  showConfirmDelete.value = false
  isDeleting.value = false
}
</script>

<template>
  <div class="card transition-all duration-300 animate-fade-in dark:bg-gray-800">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div class="flex-grow min-w-0 w-full">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate max-w-full">
          {{ link.original_url }}
        </h3>
        <div class="mt-1 flex items-center space-x-2">
          <a :href="link.short_url" target="_blank" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium truncate max-w-[250px]">
            {{ link.short_url }}
          </a>
          <button @click="copyToClipboard" class="inline-flex items-center p-1 border border-transparent rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none flex-shrink-0">
            <span v-if="copied" class="text-green-600 dark:text-green-500 text-xs">Скопировано!</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto justify-between sm:justify-end">
          <div class="flex space-x-2">
            <span>Клики: {{ link.clicks }}</span>
            <span class="mx-2">•</span>
            <span :class="{ 'text-red-500': link.expires_at && new Date(link.expires_at) < new Date() }">
              Истекает: {{ formatDate(link.expires_at) }}
            </span>
          </div>
        </div>
        <div class="flex space-x-2 w-full sm:w-auto justify-end">
          <button @click="viewStats" class="btn btn-secondary text-sm">Статистика</button>
          <div class="relative">
            <button v-if="!showConfirmDelete" @click="showConfirmDelete = true" class="btn bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800 text-sm">Удалить</button>
            <div v-else class="absolute right-0 top-0 flex">
              <button @click="showConfirmDelete = false" class="btn bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-sm">Отмена</button>
              <button @click="deleteLink" :disabled="isDeleting" class="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 text-sm ml-1">
                {{ isDeleting ? 'Удаление...' : 'Подтвердить' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLinkActive" class="mt-2 border-t pt-2 text-sm text-orange-600 dark:text-orange-400">
      Эта ссылка неактивна (истекла)
    </div>
  </div>
</template> 