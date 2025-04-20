import type { APIChannels, Channel, GenreID } from '~/types'
import { useQuery } from '@pinia/colada'
import ky from 'ky'
import { availableChannelsNumbers, channelsFetchURL } from '~/shared'
import { useSettingsStore } from '~/store/settings'

export function getChannels() {
  return ky.get(channelsFetchURL).json<APIChannels>()
}

export function useChannels() {
  const settingsStore = useSettingsStore()

  const query = useQuery({
    key: ['channels'],
    query: getChannels,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const channelsAvailable = computed<Channel[]>(() => (
    query.data.value?.channels
      .filter(channel => availableChannelsNumbers.includes(channel.keyNumber)) || []
  ))

  const channelsSorted = computed<Channel[]>(() => (
    channelsAvailable.value.slice().sort((a, b) => (a.keyNumber - b.keyNumber)).slice(0, 500) // BUG: slice 0 5 is for test
  ))

  const genres = computed<{
    [key: string]: GenreID
  }>(
    () => query.data.value?.genres && Array.isArray(query.data.value.genres)
      ? query.data.value.genres.reduce((accumulator, genre) => ({ ...accumulator, [genre.id]: genre.title }), {})
      : { },
  )

  // TODO: try to move from Entries<{ id: GenreID, title: string }> to Array<{ id: GenreID, title: string }>
  const genresList = computed(() => (
    Object.entries(genres.value)
      .filter(genre => (channelsAvailable.value.some(channel => channel.relevantGenres.some(channelGenre => channelGenre.genreId === genre[0]))))
      .sort((a, _b) => settingsStore.favoriteGenres.includes(a[0]) ? -1 : 1)
  ))

  return {
    query,
    channelsAPIResponse: query.data,
    channelsAvailable,
    channelsSorted,
    genres,
    genresList,
  }
}
