import type { APIPrograms, APIProgramsComposeTable } from '~/types'
import { useQuery } from '@pinia/colada'
import { createSharedComposable, useTimeoutFn } from '@vueuse/core'
import ky from 'ky'
import { computed } from 'vue'
import { useChannels } from '~/api/channels'
import { programsComposeTableFetchURL, programsFetchURL, programsRefetchTimeout } from '~/shared'
import { useSettingsStore } from '~/store/settings'

export function getPrograms() {
  return ky.get(programsFetchURL).json<APIPrograms>()
}

export function getProgramsComposeTable() {
  return ky.get(programsComposeTableFetchURL).json<APIProgramsComposeTable>()
}

export const usePrograms = createSharedComposable(() => {
  const settingsStore = useSettingsStore()

  const channels = useChannels()

  const programsQuery = useQuery({
    key: ['programs'],
    query: getPrograms,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const programsComposeTableQuery = useQuery({
    key: ['programs-compose-table'],
    query: getProgramsComposeTable,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // TODO: use PiniaColada functionality
  const programsFetchTimeout = useTimeoutFn(() => {
    programsQuery.refetch().then(() => programsFetchTimeout.start())
  }, programsRefetchTimeout, {
    immediate: settingsStore.isRealtimePrograms,
  })
  // TODO: same
  const programsComposeTableFetchTimeout = useTimeoutFn(() => {
    programsComposeTableQuery.refetch().then(() => programsComposeTableFetchTimeout.start())
  }, programsRefetchTimeout, {
    immediate: settingsStore.isRealtimePrograms,
  })

  const channelsPrograms = computed(() => {
    let isFinded = true

    const result = channels.channelsSorted.value
      .map((channel) => {
        const findResult = programsQuery.data.value?.schedules
          .find(schedule => (
            schedule.scheduleId === (programsComposeTableQuery.data.value?.medias.find(media => media.channelId === channel.id)?.scheduleId)
          ))
        if (isFinded && !!findResult) {
          isFinded = true
          return {
            channelId: channel.id,
            scheduleId: findResult.scheduleId,
            programs: findResult.events,
          }
        }
        return null
      })
      .filter(e => e !== null)

    return result
  })

  const isFetching = computed(() => programsQuery.isLoading.value || programsComposeTableQuery.isLoading.value)

  return {
    programsQuery,
    programsComposeTableQuery,
    isFetching,
    channelsPrograms,
    programs: programsQuery.data,
    programsComposeTable: programsComposeTableQuery.data,
  }
})
