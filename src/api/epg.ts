import type { Dayjs } from 'dayjs'
import type { APIEPG, APIEPGEvent, ChannelID, ProgramEvent, ScheduleID } from '~/types'
import { useQuery } from '@pinia/colada'
import ky from 'ky'
import { usePrograms } from '~/api/programs'
import { useDayJS } from '~/shared'

export function getChannelEPG(todaySchedule: ScheduleID | null) {
  return ky.get(`https://fe.smotreshka.tv/epg/v2/schedules/${todaySchedule || 'ERROR__NO__todaySchedule'}/spread?centralPageId=${useDayJS()().utc().format(`YYYY-MM-DD[t]12[d]12[h]`)}`).json<APIEPG>()
}

function filterByTime(event: ProgramEvent, isNext: boolean, currentTime: Dayjs) {
  const begin = useDayJS()(event.scheduledFor.begin)
  return isNext ? currentTime.isBefore(begin) : currentTime.isAfter(begin)
}

export function useChannelEPG(channelId: ChannelID, isRealtime?: Ref<boolean> | boolean) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const programs = usePrograms()

  const todaySchedule = computed(() => {
    const findResult = programs.programsComposeTable.value?.medias.find(media => media.channelId === channelId)

    if (findResult) {
      return findResult.scheduleId
    }

    return null
  })

  const query = useQuery({
    key: () => ['channel-epg', channelId],
    query: () => getChannelEPG(todaySchedule.value),
  })

  const epg = computed(() => query.data.value?.pagesWithEvents.reduce<APIEPGEvent[]>((acc, page) => [...acc, ...page.events], []) || [])

  function filterEpg(epgForFilter: APIEPGEvent[] | undefined, isNext: boolean, currentTime: Dayjs) {
    return epgForFilter?.filter(event => filterByTime(event, isNext, currentTime)) || []
  }

  const filteredEpg = {
    previous: computed(() => {
      return filterEpg(epg.value, false, reactiveProgramsCurrTime.currentTime.value)
    }),
    next: computed(() => {
      return filterEpg(epg.value, true, reactiveProgramsCurrTime.currentTime.value)
    }),
  }

  const isEpg = computed(() => filteredEpg.next.value && filteredEpg.previous.value)

  return {
    query,
    epgAPIResponse: query.data,
    epg,
    filteredEpg,
    isFetching: query.isLoading,
    isEpg,
  }
}
