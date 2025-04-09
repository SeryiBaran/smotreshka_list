<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'

import { routesNames } from '~/router'
import { useFaviconSettings } from './composables/favicon'

const route = useRoute()

const routeName = computed(() => routesNames.find(r => r.url === route.name)?.title)

useFaviconSettings()
</script>

<template>
  <div>
    <ModalsContainer />
    <TheBrandColorProvider />
    <main font-sans p="x-4 y-10" text="gray-700 dark:gray-200">
      <TheHeader />
      <h1 class="text-4xl mb-4">
        {{ routeName }}
      </h1>
      <RouterView />
      <TheFooter />
    </main>
    <TheScrollToTopButton />
  </div>
</template>
