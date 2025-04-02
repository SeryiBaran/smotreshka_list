<script lang="ts" setup>
import type { UnoCSSColorObj } from './types'
import { storeToRefs } from 'pinia'
import { createFaviconSvg, createFaviconUrl, routesNames, unoPresetColors } from '~/shared'
import { useSettingsStore } from '~/store/settings'

const route = useRoute()
const favicon = useFavicon()

const routeName = computed(() => routesNames.find(r => r.url === route.name)?.title)

const colorsConfig = unoPresetColors

const settingsStore = useSettingsStore()

const colors = computed(() => Object.entries(colorsConfig)
  .filter(([value]) => {
    return new RegExp(`^${settingsStore.brandColor}$`, 'gi').test(value)
  })
  .map(([_key, value]) => {
    if (typeof value === 'string') {
      return `--colors-brand: ${(value)};`
    }
    else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return Object.entries(value)
        .map(([key2, value2]) => {
          if (typeof value2 === 'string') {
            return `--colors-brand${key2 !== 'DEFAULT' ? `-${key2}` : ''}: ${(value2)};`
          }
          else {
            return ''
          }
        })
    }
    else {
      return ''
    }
  }))

const css = computed(() => `/* Generated with SeryiBaran unocss_preset_colors_to_css (unpublished) */
/* ${(new Date()).toUTCString()} */

:root {
  ${colors.value.flat(1).join('\n  ')}
}
`)

const { brandColor: brandColorRef } = storeToRefs(settingsStore)

function updateFavicon(color: UnoCSSColorObj) {
  favicon.value = createFaviconUrl(createFaviconSvg(color))
}

updateFavicon(colorsConfig[brandColorRef.value])

watch(brandColorRef, (newv) => {
  updateFavicon(colorsConfig[newv])
})
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component is="style">
      {{ css }}
    </component>
    <main font-sans p="x-4 y-10" text="gray-700 dark:gray-200">
      <TheHeader />
      <h1 class="text-4xl">
        {{ routeName }}
      </h1>
      <RouterView />
      <TheFooter />
    </main>
    <TheScrollToTopButton />
  </div>
</template>

<style scoped>

</style>
