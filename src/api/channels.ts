import type { APIChannels, Channel } from '~/types'
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

  const channelsFromAPI = computed<Channel[]>(
    () => query.data.value?.channels || [],
  )

  const channelsAvailable = computed<Channel[]>(() => (
    channelsFromAPI.value
      .filter(channel => availableChannelsNumbers.includes(channel.keyNumber))
  ))

  const channelsSorted = computed<Channel[]>(() => (
    channelsAvailable.value.slice().sort((a, b) => (a.keyNumber - b.keyNumber))
  ))

  const genres = computed(
    () => Array.isArray(query.data.value?.genres)
      ? query.data.value?.genres.reduce((accumulator, genre) => ({ ...accumulator, [genre.id]: genre.title }), {})
      : { },
  )

  const genresList = computed(() => (Object.entries(genres.value).sort((_a, _b) => settingsStore.favoriteGenres.includes(_a[0]) ? -1 : 1)))

  return {
    query,
    channelsAPIResponse: query.data,
    channelsFromAPI,
    channelsAvailable,
    channelsSorted,
    genres,
    genresList,
  }
}
