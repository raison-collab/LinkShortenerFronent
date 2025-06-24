<template>
  <section class="page-container my-12">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
      Почему стоит использовать наш сервис?
    </h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="card space-y-4">
        <div class="bg-primary-500 dark:bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Быстро и просто</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Создавайте короткие ссылки в один клик. Никаких сложных настроек.
        </p>
      </div>
      <div class="card space-y-4">
        <div class="bg-primary-500 dark:bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Надежность</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Стабильный сервис с высокой отказоустойчивостью и безопасностью.
        </p>
      </div>
      <div class="card space-y-4">
        <div class="bg-primary-500 dark:bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H10.5V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Статистика</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Подробная аналитика переходов и статистика использования ваших ссылок.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WhyUsSection'
}
</script> 