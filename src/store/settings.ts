import type {
  ChannelsListMode,
} from '~/shared'
import type { GenreID, UnoCSSColorName } from '~/types'
import { defineStore } from 'pinia'
import {
  defaultBrandColor,
  defaultChannelsImagesSize,
  defaultChannelsListMode,
  defaultFavoriteGenres,
  defaultIsOpenNewTab,
  defaultIsShowChannelsImages,
  defaultIsShowPrograms,
} from '~/shared'

export const useSettingsStore = defineStore('smotreshka_list__settings', () => {
  const favoriteGenres = ref<GenreID[]>(defaultFavoriteGenres)

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
    favoriteGenres.value = defaultFavoriteGenres
  }

  // ...

  const brandColor = ref<UnoCSSColorName>(defaultBrandColor)

  function brandColorSet(newColor: UnoCSSColorName) {
    brandColor.value = newColor
  }

  function brandColorReset() {
    brandColor.value = defaultBrandColor
  }

  // ...

  const isOpenNewTab = ref(defaultIsOpenNewTab)

  function isOpenNewTabReset() {
    isOpenNewTab.value = defaultIsOpenNewTab
  }

  // ...

  const isShowChannelsImages = ref(defaultIsShowChannelsImages)

  function isShowChannelsImagesReset() {
    isShowChannelsImages.value = defaultIsShowChannelsImages
  }

  // ...

  const isShowPrograms = ref(defaultIsShowPrograms)

  function isShowProgramsReset() {
    isShowPrograms.value = defaultIsShowPrograms
  }

  // ...

  const channelsListMode = ref<ChannelsListMode>(defaultChannelsListMode)

  function channelsListModeSet(newMode: ChannelsListMode) {
    channelsListMode.value = newMode
  }

  function channelsListModeReset() {
    channelsListMode.value = defaultChannelsListMode
  }

  // ...

  const channelsImagesSize = ref<number>(defaultChannelsImagesSize)

  function channelsImagesSizeReset() {
    channelsImagesSize.value = defaultChannelsImagesSize
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

    $reset,
  }
})
