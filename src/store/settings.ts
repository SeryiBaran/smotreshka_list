import type { GenreID } from '~/types'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('smotreshka_list__settings', () => {
  const favoriteGenres = ref<GenreID[]>(['federal', 'kids'])

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

  return {
    favoriteGenres,
    favoriteGenreAdd,
    favoriteGenreRemove,
    favoriteGenreToggle,
  }
})
