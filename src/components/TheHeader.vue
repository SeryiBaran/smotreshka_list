<script lang="ts" setup>

</script>

<template>
  <div class="mb-4 pb-4 border-b-1 border-brand-500 dark:border-brand-300/50">
    <RouterLink to="/" class="headerMainLink inline-flex gap-4">
      <span class="i-tabler:device-tv-old text-6xl inline-block" />
      <div>
        <h1 class="text-4xl">
          Смотрёшка
        </h1>
        <p class="mt-1 block">
          Список каналов
        </p>
      </div>
    </RouterLink>
    <p class="text-xs">
      Данные актуальны на момент 01.04.2025 01:48 по МСК
    </p>
  </div>
</template>

<style scoped>
.headerMainLink:hover {
  @apply text-brand-600 dark:text-brand-300;
}
</style>
