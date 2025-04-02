<script lang="ts" setup>
import type { UnoCSSColorObj } from './types'
import { storeToRefs } from 'pinia'
import { routesNames, unoPresetColors } from '~/shared'
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

function createFaviconSvg(color: UnoCSSColorObj) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28"><rect width="100%" height="100%" fill="${color[100]}" rx="4" /><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path transform="translate(3 3)" fill="none" stroke="${color[700]}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4m7 4v13m3-5v.01M18 12v.01"/></svg>`
}

function createFaviconUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

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
