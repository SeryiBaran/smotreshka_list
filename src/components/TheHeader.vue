<script lang="ts" setup>
import { appGitVerDate, appGitVerHash, useDayJS } from '~/shared'
</script>

<template>
  <div class="mb-4 pb-4 border-b-1 border-brand-500 dark:border-brand-300/50">
    <div class="flex gap-2 justify-between">
      <RouterLink to="/" class="colorsTransition no-outline headerMainLink inline-flex gap-4 items-center">
        <span class="colorsTransition headerLogoGontainer p-2 border-1 border-brand-700 rounded-2 border-solid bg-brand-100 flex items-center justify-center dark:border-transparent">
          <span class="colorsTransition headerLogo i-tabler:device-tv-old text-3xl text-brand-700 block sm:text-4xl" />
        </span>
        <div>
          <span class="text-2xl sm:text-3xl">
            Смотрёшка
          </span>
          <p class="text-sm mt-1 block sm:text-size-base">
            Список от SeryiBaran
          </p>
        </div>
      </RouterLink>
      <div class="headerButtons flex gap-1 items-center justify-center max-[32rem]:flex-col">
        <button
          class="colorsTransition icon-btn"
          aria-label="Переключить тему"
          title="Переключить тему"
          @click="toggleDark()"
        >
          <div class="i-carbon-sun dark:i-carbon-moon text-3xl inline-block md:text-5xl" />
        </button>
        <RouterLink to="/settings" class="colorsTransition icon-btn" title="Настройки" aria-label="Настройки">
          <span class="i-carbon:settings text-3xl inline-block md:text-5xl" />
        </RouterLink>
      </div>
    </div>
    <p class="text-xs mt-2">
      Версия: {{ appGitVerHash.slice(0, 8) }} {{ useDayJS()(appGitVerDate).format() }}
    </p>
  </div>
</template>

<style scoped>
.headerMainLink:hover {
  @apply text-brand-600 dark:text-brand-400;
}

.headerMainLink:hover .headerLogoGontainer {
  @apply bg-brand-500 border-brand-500;
}

.headerMainLink:hover .headerLogo {
  @apply text-brand-100;
}
</style>
