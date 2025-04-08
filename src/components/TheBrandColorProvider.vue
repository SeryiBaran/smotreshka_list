<script lang="ts" setup>
import { unoPresetColors } from '~/shared'
import { useSettingsStore } from '~/store/settings'

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
</script>

<template>
  <!-- eslint-disable-next-line vue/require-component-is -->
  <component is="style">
    {{ css }}
  </component>
</template>

<style scoped>

</style>
