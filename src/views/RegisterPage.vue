<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const termsAccepted = ref(false)

const passwordStrength = computed(() => {
  if (!password.value) return { score: 0, label: '', color: '' }
  
  let score = 0
  if (password.value.length >= 8) score++
  if (/[A-Z]/.test(password.value)) score++
  if (/[a-z]/.test(password.value)) score++
  if (/[0-9]/.test(password.value)) score++
  if (/[^A-Za-z0-9]/.test(password.value)) score++
  
  const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Надёжный']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600']
  
  return {
    score,
    label: labels[score - 1] || '',
    color: colors[score - 1] || '',
  }
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
}

const validateForm = () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'Пожалуйста, заполните все поля'
    return false
  }
  
  if (!validateEmail()) {
    error.value = 'Пожалуйста, введите корректный email'
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return false
  }
  
  if (password.value.length < 8) {
    error.value = 'Пароль должен содержать не менее 8 символов'
    return false
  }
  
  if (passwordStrength.value.score < 3) {
    error.value = 'Пожалуйста, используйте более надёжный пароль'
    return false
  }
  
  if (!termsAccepted.value) {
    error.value = 'Пожалуйста, примите условия использования'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  const success = await authStore.register(email.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = authStore.error || 'Ошибка при регистрации'
  }
  loading.value = false
}
</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        Создайте аккаунт
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Уже есть аккаунт?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          Войти
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 dark:bg-red-900 dark:border-red-600 dark:text-red-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-200">{{ error }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Электронная почта
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="input w-full"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Пароль
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="new-password"
                required
                class="input w-full pr-10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <!-- Password strength indicator -->
            <div v-if="password" class="mt-2">
              <div class="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-1 transition-all duration-300"
                  :class="passwordStrength.color"
                  :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                ></div>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ passwordStrength.label }}
              </p>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Подтверждение пароля
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                name="confirm-password"
                autocomplete="new-password"
                required
                class="input w-full"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="termsAccepted"
              name="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Я согласен с
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Условиями и Политикой конфиденциальности
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn btn-primary py-2"
              :disabled="loading"
            >
              <span v-if="loading">Создание аккаунта...</span>
              <span v-else>Создать аккаунт</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 