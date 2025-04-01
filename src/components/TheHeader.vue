<script lang="ts" setup>

</script>

<template>
  <div class="mb-4 pb-4 border-b-1 border-brand-500 dark:border-brand-300/50">
    <div class="flex gap-2 justify-between">
      <RouterLink to="/" class="colorsTransition headerMainLink inline-flex gap-4">
        <span class="i-tabler:device-tv-old text-5xl inline-block sm:text-6xl" />
        <div>
          <h1 class="text-3xl sm:text-4xl">
            Смотрёшка
          </h1>
          <p class="mt-1 block">
            Список каналов
          </p>
        </div>
      </RouterLink>
      <div class="headerButtons flex gap-1 items-center justify-center max-[32rem]:flex-col">
        <button class="colorsTransition icon-btn" @click="toggleDark()">
          <div class="i-carbon-sun dark:i-carbon-moon text-3xl inline-block md:text-5xl" />
        </button>
        <RouterLink to="/settings" class="colorsTransition icon-btn">
          <span class="i-tabler:settings text-3xl inline-block md:text-5xl" />
        </RouterLink>
      </div>
    </div>
    <p class="text-xs mt-4">
      Данные актуальны на момент 01.04.2025 01:48 по МСК
    </p>
  </div>
</template>

<style scoped>
:where(.headerMainLink, .settingsLink):hover {
  @apply text-brand-600 dark:text-brand-400;
}
</style>
