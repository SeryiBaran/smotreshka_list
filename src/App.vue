<script lang="ts" setup>
import { computed } from 'vue'

import { ModalsContainer } from 'vue-final-modal'
import { useRoute } from 'vue-router'
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
    <RouterLink to="/easteregg" class="bg-transparent h-[1px] w-[1px] bottom-[0px] right-[0px] absolute hover:h-10 hover:w-10" aria-hidden="true" tabindex="-1" />
  </div>
</template>
