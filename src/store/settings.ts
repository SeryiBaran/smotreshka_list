import type {
  ChannelsListMode,
} from '~/shared'
import type { ChannelID, GenreID, UnoCSSColorName } from '~/types'
import { defineStore } from 'pinia'
import { settingsDefaults } from '~/shared'

export const useSettingsStore = defineStore('smotreshka_list__settings', () => {
  const resetFunctions: (() => void)[] = []

  function createSetting<T>(defaultValue: T, registerReset: boolean = true) {
    const setting = ref<T>(defaultValue)

    function reset() {
      setting.value = defaultValue
    }

    if (registerReset)
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

  const favoriteChannels = createSetting<ChannelID[]>(settingsDefaults.favoriteGenres, false)
  function favoriteChannelAdd(channelId: ChannelID) {
    favoriteChannels.setting.value.push(channelId)
  }
  function favoriteChannelRemove(channelId: ChannelID) {
    favoriteChannels.setting.value = favoriteChannels.setting.value.filter(favoriteChannelId => favoriteChannelId !== channelId)
  }
  function favoriteChannelToggle(channelId: ChannelID) {
    if (favoriteChannels.setting.value.includes(channelId)) {
      favoriteChannelRemove(channelId)
    }
    else {
      favoriteChannelAdd(channelId)
    }
  }

  const brandColor = createSetting<UnoCSSColorName>(settingsDefaults.brandColor)
  function brandColorSet(newColor: UnoCSSColorName) {
    brandColor.setting.value = newColor
  }

  const isColorizeBackground = createSetting(settingsDefaults.isColorizeBackground)
  const backgroundColorizationOpacity = createSetting<number>(settingsDefaults.backgroundColorizationOpacity.default)

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
  const isShowProgramPopups = createSetting(settingsDefaults.isShowProgramPopups)
  const isSortChannelsByFavorite = createSetting(settingsDefaults.isSortChannelsByFavorite)
  const searchDebounce = createSetting(settingsDefaults.searchDebounce)

  function $reset() {
    resetFunctions.forEach(reset => reset())
  }

  return {
    favoriteGenres: favoriteGenres.setting,
    favoriteGenreAdd,
    favoriteGenreRemove,
    favoriteGenreToggle,
    favoriteGenresReset: favoriteGenres.reset,

    favoriteChannels: favoriteChannels.setting,
    favoriteChannelAdd,
    favoriteChannelRemove,
    favoriteChannelToggle,
    favoriteChannelsReset: favoriteChannels.reset,

    brandColor: brandColor.setting,
    brandColorSet,
    brandColorReset: brandColor.reset,

    isColorizeBackground: isColorizeBackground.setting,
    isColorizeBackgroundReset: isColorizeBackground.reset,

    backgroundColorizationOpacity: backgroundColorizationOpacity.setting,
    backgroundColorizationOpacityReset: backgroundColorizationOpacity.reset,

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

    isShowProgramPopups: isShowProgramPopups.setting,
    isShowProgramPopupsReset: isShowProgramPopups.reset,

    isSortChannelsByFavorite: isSortChannelsByFavorite.setting,
    isSortChannelsByFavoriteReset: isSortChannelsByFavorite.reset,

    searchDebounce: searchDebounce.setting,
    searchDebounceReset: searchDebounce.reset,

    $reset,
  }
}, {
  persistedState: {
    persist: true,
  },
})
