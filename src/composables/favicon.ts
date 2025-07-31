import type { UnoCSSColorObj } from '~/types'
import { useFavicon } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { createFaviconSvg, createFaviconUrl, unoPresetColors } from '~/shared'
import { useSettingsStore } from '~/store/settings'

export function useFaviconSettings() {
  const favicon = useFavicon()

  const settingsStore = useSettingsStore()

  const { brandColor: brandColorRef } = storeToRefs(settingsStore)

  function updateFavicon(color: UnoCSSColorObj) {
    favicon.value = createFaviconUrl(createFaviconSvg(color))
  }

  updateFavicon(unoPresetColors[brandColorRef.value])

  watch(brandColorRef, (newv) => {
    updateFavicon(unoPresetColors[newv])
  })
}
