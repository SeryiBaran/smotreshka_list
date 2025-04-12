<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'

import { routesNames } from '~/router'
import { useFaviconSettings } from './composables/favicon'

const route = useRoute()

const routeName = computed(() => routesNames.find(r => r.url === route.name)?.title)

useFaviconSettings()
</script>

<template>
  <div class="flex grow flex-col">
    <ModalsContainer />
    <TheBrandColorProvider />
    <main class="text-gray-700 font-sans px-4 py-10 flex grow flex-col dark:text-gray-200">
      <TheHeader />
      <h1 class="text-4xl mb-4">
        {{ routeName }}
      </h1>
      <div class="flex grow flex-col">
        <RouterView />
      </div>
      <TheFooter />
    </main>
    <TheScrollToTopButton />
  </div>
</template>
