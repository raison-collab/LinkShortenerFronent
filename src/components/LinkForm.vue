<script setup>
import { ref, computed, watch } from 'vue'
import { useLinksStore } from '../stores/links'

const props = defineProps({
  linkData: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['created', 'updated'])

const linksStore = useLinksStore()

const url = ref(props.linkData.original_url || '')
const customCode = ref(props.linkData.short_code || '')
const expiresAt = ref(props.linkData.expires_at ? new Date(props.linkData.expires_at).toISOString().split('T')[0] : '')
const loading = computed(() => linksStore.loading)
const error = computed(() => linksStore.error)

watch(() => props.linkData, (newData) => {
  if (newData) {
    url.value = newData.original_url || ''
    customCode.value = newData.short_code || ''
    expiresAt.value = newData.expires_at ? new Date(newData.expires_at).toISOString().split('T')[0] : ''
  }
})

const validateForm = () => {
  if (!url.value) {
    return false
  }
  
  try {
    new URL(url.value)
    return true
  } catch (e) {
    return false
  }
}

const formatExpiresAt = () => {
  if (!expiresAt.value) return undefined
  
  const date = new Date(expiresAt.value)
  date.setHours(23, 59, 59)
  return date.toISOString()
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  const linkData = {
    url: url.value,
  }
  
  if (customCode.value) {
    linkData.custom_code = customCode.value
  }
  
  if (expiresAt.value) {
    linkData.expires_at = formatExpiresAt()
  }
  
  let result
  
  if (props.isEditing) {
    result = await linksStore.updateLink(props.linkData.id, {
      expires_at: formatExpiresAt()
    })
    if (result) {
      emit('updated', result)
    }
  } else {
    result = await linksStore.createLink(linkData)
    if (result) {
      url.value = ''
      customCode.value = ''
      expiresAt.value = ''
      emit('created', result)
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL для сокращения</label>
      <input
        id="url"
        v-model="url"
        type="text"
        :disabled="isEditing"
        placeholder="https://example.com/very-long-url"
        class="input w-full mt-1"
        :class="{ 'bg-gray-100 dark:bg-gray-700': isEditing }"
      >
    </div>
    
    <div v-if="!isEditing">
      <label for="customCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Пользовательский код (необязательно)</label>
      <input
        id="customCode"
        v-model="customCode"
        type="text"
        placeholder="my-custom-code"
        class="input w-full mt-1"
      >
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Оставьте пустым для автоматической генерации</p>
    </div>
    
    <div>
      <label for="expiresAt" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Срок действия (необязательно)</label>
      <input
        id="expiresAt"
        v-model="expiresAt"
        type="date"
        class="input w-full mt-1"
      >
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-600 dark:text-red-300">
      <p>{{ error }}</p>
    </div>
    
    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Обработка...</span>
        <span v-else>{{ isEditing ? 'Обновить ссылку' : 'Создать короткую ссылку' }}</span>
      </button>
    </div>
  </form>
</template> 