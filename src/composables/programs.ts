import type { Dayjs } from 'dayjs'
import type { APIEPGPageWithEvents, ChannelID, ChannelPrograms, ChannelsPrograms, ProgramEvent } from '~/types'
import { isCurrentProgram, useDayJS } from '~/shared'
import { useSettingsStore } from '~/store/settings'

const currentTime = ref<Dayjs>(useDayJS()())

const timeout = useTimeoutFn(() => {
  currentTime.value = useDayJS()()

  timeout.start()
}, 10000)

timeout.start()

export function useReactiveProgramsCurrTime(isRealtime?: Ref<boolean> | boolean) {
  let returnedCurrentTime: Ref<Dayjs> | Dayjs

  if ((isRef(isRealtime) && isRealtime && isRealtime.value) || typeof isRealtime === 'boolean' || (isRealtime === undefined)) {
    returnedCurrentTime = computed(() => currentTime.value)
  }
  else {
    returnedCurrentTime = ref(useDayJS()())
  }

  return { currentTime: returnedCurrentTime, timeout }
}

export function useIsRealtime(propsIsRealtime: Ref<boolean> | boolean) {
  const settingsStore = useSettingsStore()

  return propsIsRealtime !== undefined ? propsIsRealtime : settingsStore.isRealtimePrograms
}

export function useCurrentProgramPercent(currentProgram: Ref<ProgramEvent | null | undefined>, isRealtime?: Ref<boolean> | boolean) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgramPercent = computed(() => {
    const percents = (100 / (useDayJS()(currentProgram.value?.scheduledFor.end).diff(useDayJS()(currentProgram.value?.scheduledFor.begin)) / reactiveProgramsCurrTime.currentTime.value.diff(useDayJS()(currentProgram.value?.scheduledFor.begin))))

    return Math.floor(percents * 100) / 100
  })

  return currentProgramPercent
}

export function useChannelPrograms(channelId: ChannelID, channelsPrograms: Ref<ChannelsPrograms | null>) {
  const channelPrograms = computed(() => {
    return channelsPrograms.value?.find(program => program.channelId === channelId) // I AM FUCKED MY MIND ABOUT 2 HOURS WITHOUT THESE `!`.
  })

  return channelPrograms
}

export function getCurrentProgram(programs: ProgramEvent[], currentTime: Dayjs) {
  return programs.find(program => isCurrentProgram(program.scheduledFor, currentTime))
}

export function useCurrentProgram(channelPrograms: Ref<ChannelPrograms['programs'] | APIEPGPageWithEvents['events'] | undefined>, isRealtime?: Ref<boolean> | boolean) {
  // log(`useCurrentProgram, channelPrograms is ${JSON.stringify(channelPrograms.value)}`)
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgram = computed(() => {
    if (channelPrograms.value && channelPrograms.value.length > 0) {
      return getCurrentProgram(channelPrograms.value, reactiveProgramsCurrTime.currentTime.value)
    }
    else {
      return null
    }
  })

  return currentProgram
}
