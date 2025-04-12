import type { APIEPG, APIEPGEvent, ChannelID, ScheduleID } from '~/types'
import { useQuery } from '@pinia/colada'
import ky from 'ky'
import { usePrograms } from '~/api/programs'
import { useDayJS } from '~/shared'

export function getChannelEPG(todaySchedule: ScheduleID | null) {
  return ky.get(`https://fe.smotreshka.tv/epg/v2/schedules/${todaySchedule || 'ERROR__NO__todaySchedule'}/spread?centralPageId=${useDayJS()().utc().format(`YYYY-MM-DD[t]12[d]12[h]`)}`).json<APIEPG>()
}

export function useChannelEPG(channelId: ChannelID) {
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

  const filteredEpg = computed(() => query.data.value?.pagesWithEvents.reduce<APIEPGEvent[]>((acc, page) => [...acc, ...page.events], []).filter(event => useDayJS()().isBefore(useDayJS()(event.scheduledFor.begin))))

  return {
    query,
    epgAPIResponse: query.data,
    filteredEpg,
  }
}
