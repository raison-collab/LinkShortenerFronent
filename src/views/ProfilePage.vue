<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.getUser)

// For email update
const editingEmail = ref(false)
const newEmail = ref('')
const emailSuccess = ref(false)
const emailError = ref('')
const emailLoading = ref(false)

// For password update
const changingPassword = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPasswords = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const passwordLoading = ref(false)

onMounted(async () => {
  await authStore.fetchUserProfile()
  newEmail.value = user.value?.email || ''
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const handleUpdateEmail = async () => {
  emailError.value = ''
  emailSuccess.value = false
  
  if (!newEmail.value) {
    emailError.value = 'Email не может быть пустым'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail.value)) {
    emailError.value = 'Пожалуйста, введите корректный email'
    return
  }
  
  emailLoading.value = true
  const success = await authStore.updateProfile({ email: newEmail.value })
  
  if (success) {
    emailSuccess.value = true
    setTimeout(() => {
      editingEmail.value = false
      emailSuccess.value = false
    }, 2000)
  } else {
    emailError.value = authStore.error || 'Не удалось обновить email'
  }
  
  emailLoading.value = false
}

const cancelEmailEdit = () => {
  editingEmail.value = false
  newEmail.value = user.value?.email || ''
  emailError.value = ''
}

const handleUpdatePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = false
  
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Все поля обязательны для заполнения'
    return
  }
  
  if (newPassword.value.length < 8) {
    passwordError.value = 'Пароль должен содержать не менее 8 символов'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Пароли не совпадают'
    return
  }
  
  passwordLoading.value = true
  const success = await authStore.changePassword(currentPassword.value, newPassword.value)
  
  if (success) {
    passwordSuccess.value = true
    setTimeout(() => {
      changingPassword.value = false
      passwordSuccess.value = false
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }, 2000)
  } else {
    passwordError.value = authStore.error || 'Не удалось изменить пароль'
  }
  
  passwordLoading.value = false
}

const cancelPasswordChange = () => {
  changingPassword.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
}
</script>

<template>
  <div class="py-6 animate-fade-in">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ваш профиль</h1>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="py-4 space-y-4">
        <!-- User Info Card -->
        <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Информация об аккаунте
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Ваши персональные данные и настройки.
            </p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Адрес электронной почты
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  <div v-if="!editingEmail" class="flex justify-between items-center">
                    <span>{{ user?.email }}</span>
                    <button 
                      @click="editingEmail = true" 
                      class="btn btn-secondary text-sm"
                    >
                      Изменить
                    </button>
                  </div>
                  
                  <form v-else @submit.prevent="handleUpdateEmail" class="space-y-3">
                    <div>
                      <input 
                        type="email" 
                        v-model="newEmail" 
                        class="input w-full"
                        placeholder="Введите новый email"
                      />
                    </div>
                    
                    <div v-if="emailError" class="text-sm text-red-600 dark:text-red-400">
                      {{ emailError }}
                    </div>
                    
                    <div v-if="emailSuccess" class="text-sm text-green-600 dark:text-green-400">
                      Email успешно обновлен!
                    </div>
                    
                    <div class="flex space-x-2">
                      <button 
                        type="submit" 
                        class="btn btn-primary text-sm" 
                        :disabled="emailLoading"
                      >
                        {{ emailLoading ? 'Сохранение...' : 'Сохранить' }}
                      </button>
                      <button 
                        type="button" 
                        @click="cancelEmailEdit" 
                        class="btn btn-secondary text-sm"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </dd>
              </div>
              
              <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Пароль
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  <div v-if="!changingPassword" class="flex justify-between items-center">
                    <span>••••••••</span>
                    <button 
                      @click="changingPassword = true" 
                      class="btn btn-secondary text-sm"
                    >
                      Изменить пароль
                    </button>
                  </div>
                  
                  <form v-else @submit.prevent="handleUpdatePassword" class="space-y-3">
                    <div>
                      <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Текущий пароль
                      </label>
                      <div class="mt-1 relative">
                        <input 
                          :type="showPasswords ? 'text' : 'password'"
                          id="current-password" 
                          v-model="currentPassword" 
                          class="input w-full"
                          placeholder="Введите текущий пароль"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Новый пароль
                      </label>
                      <div class="mt-1 relative">
                        <input 
                          :type="showPasswords ? 'text' : 'password'"
                          id="new-password" 
                          v-model="newPassword" 
                          class="input w-full"
                          placeholder="Введите новый пароль"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Подтвердите новый пароль
                      </label>
                      <div class="mt-1 relative">
                        <input 
                          :type="showPasswords ? 'text' : 'password'"
                          id="confirm-password" 
                          v-model="confirmPassword" 
                          class="input w-full"
                          placeholder="Подтвердите новый пароль"
                        />
                      </div>
                    </div>
                    
                    <div v-if="passwordError" class="text-sm text-red-600 dark:text-red-400">
                      {{ passwordError }}
                    </div>
                    
                    <div v-if="passwordSuccess" class="text-sm text-green-600 dark:text-green-400">
                      Пароль успешно обновлен!
                    </div>
                    
                    <div class="flex space-x-2">
                      <button 
                        type="submit" 
                        class="btn btn-primary text-sm" 
                        :disabled="passwordLoading"
                      >
                        {{ passwordLoading ? 'Сохранение...' : 'Сохранить' }}
                      </button>
                      <button 
                        type="button" 
                        @click="cancelPasswordChange" 
                        class="btn btn-secondary text-sm"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </dd>
              </div>
              
              <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Дата создания аккаунта
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  {{ formatDate(user?.created_at) }}
                </dd>
              </div>
              
              <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Последнее обновление
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  {{ formatDate(user?.updated_at) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 