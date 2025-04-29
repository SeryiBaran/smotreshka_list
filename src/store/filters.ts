import type { GenreID } from '~/types'
import { defineStore, storeToRefs } from 'pinia'
import { useSettingsStore } from './settings'

export const useFiltersStore = defineStore('smotreshka_list__filters', () => {
  const { searchDebounce } = storeToRefs(useSettingsStore())

  const searchValue = ref('')
  const searchValueDebounced = refDebounced(searchValue, searchDebounce)
  const searchValueDebouncedTrimmed = computed(() => searchValueDebounced.value.trim())

  function searchValueReset() {
    searchValue.value = ''
  }

  // ...

  const selectedGenre = ref<GenreID | null>(null)

  function selectedGenreSetOrToggle(genreId: GenreID) {
    selectedGenre.value = (selectedGenre.value !== genreId ? genreId : null)
  }

  function selectedGenreReset() {
    selectedGenre.value = null
  }

  // ...

  function $reset() {
    searchValueReset()
    selectedGenreReset()
  }

  // ...

  return {
    searchValue,
    searchValueDebounced,
    searchValueDebouncedTrimmed,
    searchValueReset,

    selectedGenre,
    selectedGenreSetOrToggle,
    selectedGenreReset,

    $reset,
  }
})
