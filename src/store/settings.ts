import type { GenreID, UnoCSSColorName } from '~/types'
import { defineStore } from 'pinia'
import { defaultBrandColor, defaultFavoriteGenres, defaultIsOpenNewTab } from '~/shared'

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

  function $reset() {
    favoriteGenresReset()
    brandColorReset()
    isOpenNewTabReset()
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

    $reset,
  }
})
