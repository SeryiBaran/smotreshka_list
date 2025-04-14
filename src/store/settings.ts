import type {
  ChannelsListMode,
} from '~/shared'
import type { GenreID, UnoCSSColorName } from '~/types'
import { defineStore } from 'pinia'
import { settingsDefaults } from '~/shared'

export const useSettingsStore = defineStore('smotreshka_list__settings', () => {
  const resetFunctions: (() => void)[] = []

  function createSetting<T>(defaultValue: T) {
    const setting = ref<T>(defaultValue)

    function reset() {
      setting.value = defaultValue
    }

    resetFunctions.push(reset)
    return { setting, reset }
  }

  const favoriteGenres = createSetting<GenreID[]>(settingsDefaults.favoriteGenres)
  function favoriteGenreAdd(genreId: GenreID) {
    favoriteGenres.setting.value.push(genreId)
  }
  function favoriteGenreRemove(genreId: GenreID) {
    favoriteGenres.setting.value = favoriteGenres.setting.value.filter(favoriteGenreId => favoriteGenreId !== genreId)
  }
  function favoriteGenreToggle(genreId: GenreID) {
    if (favoriteGenres.setting.value.includes(genreId)) {
      favoriteGenreRemove(genreId)
    }
    else {
      favoriteGenreAdd(genreId)
    }
  }

  const brandColor = createSetting<UnoCSSColorName>(settingsDefaults.brandColor)
  function brandColorSet(newColor: UnoCSSColorName) {
    brandColor.setting.value = newColor
  }

  const isOpenNewTab = createSetting(settingsDefaults.isOpenNewTab)
  const isShowChannelsImages = createSetting(settingsDefaults.isShowChannelsImages)
  const isShowPrograms = createSetting(settingsDefaults.isShowPrograms)
  const channelsListMode = createSetting<ChannelsListMode>(settingsDefaults.channelsListMode)
  function channelsListModeSet(newMode: ChannelsListMode) {
    channelsListMode.setting.value = newMode
  }

  const channelsImagesSize = createSetting(settingsDefaults.channelsImagesSize.default)
  const isShowInfoOnHover = createSetting(settingsDefaults.isShowInfoOnHover)
  const tvKeyboardDebounce = createSetting(settingsDefaults.tvKeyboardDebounce.default)
  const tvKeyboardHideTime = createSetting(settingsDefaults.tvKeyboardHideTime.default)
  const isRealtimePrograms = createSetting(settingsDefaults.isRealtimePrograms)

  function $reset() {
    resetFunctions.forEach(reset => reset())
  }

  return {
    favoriteGenres: favoriteGenres.setting,
    favoriteGenreAdd,
    favoriteGenreRemove,
    favoriteGenreToggle,
    favoriteGenresReset: favoriteGenres.reset,

    brandColor: brandColor.setting,
    brandColorSet,
    brandColorReset: brandColor.reset,

    isOpenNewTab: isOpenNewTab.setting,
    isOpenNewTabReset: isOpenNewTab.reset,

    isShowChannelsImages: isShowChannelsImages.setting,
    isShowChannelsImagesReset: isShowChannelsImages.reset,

    isShowPrograms: isShowPrograms.setting,
    isShowProgramsReset: isShowPrograms.reset,

    channelsListMode: channelsListMode.setting,
    channelsListModeSet,
    channelsListModeReset: channelsListMode.reset,

    channelsImagesSize: channelsImagesSize.setting,
    channelsImagesSizeReset: channelsImagesSize.reset,

    isShowInfoOnHover: isShowInfoOnHover.setting,
    isShowInfoOnHoverReset: isShowInfoOnHover.reset,

    tvKeyboardDebounce: tvKeyboardDebounce.setting,
    tvKeyboardDebounceReset: tvKeyboardDebounce.reset,

    tvKeyboardHideTime: tvKeyboardHideTime.setting,
    tvKeyboardHideTimeReset: tvKeyboardHideTime.reset,

    isRealtimePrograms: isRealtimePrograms.setting,
    isRealtimeProgramsReset: isRealtimePrograms.reset,

    $reset,
  }
}, {
  persistedState: {
    persist: true,
  },
})
