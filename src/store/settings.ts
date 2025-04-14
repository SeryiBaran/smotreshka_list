import type {
  ChannelsListMode,
} from '~/shared'
import type { GenreID, UnoCSSColorName } from '~/types'
import { defineStore } from 'pinia'
import { settingsDefaults } from '~/shared'

export const useSettingsStore = defineStore('smotreshka_list__settings', () => {
  const favoriteGenres = ref<GenreID[]>(settingsDefaults.favoriteGenres)

  function favoriteGenreAdd(genreId: GenreID) {
    favoriteGenres.value.push(genreId)
  }

  function favoriteGenreRemove(genreId: GenreID) {
    favoriteGenres.value = favoriteGenres.value.filter(favoriteGenreId => favoriteGenreId !== genreId)
  }

  function favoriteGenreToggle(genreId: GenreID) {
    if (favoriteGenres.value.includes(genreId)) {
      favoriteGenreRemove(genreId)
    }
    else {
      favoriteGenreAdd(genreId)
    }
  }

  function favoriteGenresReset() {
    favoriteGenres.value = settingsDefaults.favoriteGenres
  }

  // ...

  const brandColor = ref<UnoCSSColorName>(settingsDefaults.brandColor)

  function brandColorSet(newColor: UnoCSSColorName) {
    brandColor.value = newColor
  }

  function brandColorReset() {
    brandColor.value = settingsDefaults.brandColor
  }

  // ...

  const isOpenNewTab = ref(settingsDefaults.isOpenNewTab)

  function isOpenNewTabReset() {
    isOpenNewTab.value = settingsDefaults.isOpenNewTab
  }

  // ...

  const isShowChannelsImages = ref(settingsDefaults.isShowChannelsImages)

  function isShowChannelsImagesReset() {
    isShowChannelsImages.value = settingsDefaults.isShowChannelsImages
  }

  // ...

  const isShowPrograms = ref(settingsDefaults.isShowPrograms)

  function isShowProgramsReset() {
    isShowPrograms.value = settingsDefaults.isShowPrograms
  }

  // ...

  const channelsListMode = ref<ChannelsListMode>(settingsDefaults.channelsListMode)

  function channelsListModeSet(newMode: ChannelsListMode) {
    channelsListMode.value = newMode
  }

  function channelsListModeReset() {
    channelsListMode.value = settingsDefaults.channelsListMode
  }

  // ...

  const channelsImagesSize = ref<number>(settingsDefaults.channelsImagesSize.default)

  function channelsImagesSizeReset() {
    channelsImagesSize.value = settingsDefaults.channelsImagesSize.default
  }

  // ...

  const isShowInfoOnHover = ref<boolean>(settingsDefaults.isShowInfoOnHover)

  function isShowInfoOnHoverReset() {
    isShowInfoOnHover.value = settingsDefaults.isShowInfoOnHover
  }

  // ...

  const tvKeyboardDebounce = ref<number>(settingsDefaults.tvKeyboardDebounce.default)

  function tvKeyboardDebounceReset() {
    tvKeyboardDebounce.value = settingsDefaults.tvKeyboardDebounce.default
  }

  // ...

  const tvKeyboardHideTime = ref<number>(settingsDefaults.tvKeyboardHideTime.default)

  function tvKeyboardHideTimeReset() {
    tvKeyboardHideTime.value = settingsDefaults.tvKeyboardHideTime.default
  }

  // ...

  const isRealtimePrograms = ref<boolean>(settingsDefaults.isRealtimePrograms)

  function isRealtimeProgramsReset() {
    isRealtimePrograms.value = settingsDefaults.isRealtimePrograms
  }

  // ...

  function $reset() {
    favoriteGenresReset()
    brandColorReset()
    isOpenNewTabReset()
    isShowChannelsImagesReset()
    isShowProgramsReset()
    channelsListModeReset()
    channelsImagesSizeReset()
    isShowInfoOnHoverReset()
    tvKeyboardDebounceReset()
    tvKeyboardHideTimeReset()
    isRealtimeProgramsReset()
  }

  return {
    favoriteGenres,
    favoriteGenreAdd,
    favoriteGenreRemove,
    favoriteGenreToggle,
    favoriteGenresReset,

    brandColor,
    brandColorSet,
    brandColorReset,

    isOpenNewTab,
    isOpenNewTabReset,

    isShowChannelsImages,
    isShowChannelsImagesReset,

    isShowPrograms,
    isShowProgramsReset,

    channelsListMode,
    channelsListModeSet,
    channelsListModeReset,

    channelsImagesSize,
    channelsImagesSizeReset,

    isShowInfoOnHover,
    isShowInfoOnHoverReset,

    tvKeyboardDebounce,
    tvKeyboardDebounceReset,

    tvKeyboardHideTime,
    tvKeyboardHideTimeReset,

    isRealtimePrograms,
    isRealtimeProgramsReset,

    $reset,
  }
}, {
  persistedState: {
    persist: true,
  },
})
