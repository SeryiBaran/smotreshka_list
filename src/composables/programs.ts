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

export function useReactiveProgramsCurrTime(isRealtime?: MaybeRef<boolean>) {
  let returnedCurrentTime: Ref<Dayjs> | Dayjs

  if (toValue(isRealtime)) {
    returnedCurrentTime = computed(() => currentTime.value)
  }
  else {
    returnedCurrentTime = ref(useDayJS()())
  }

  return { currentTime: returnedCurrentTime, timeout }
}

export function useIsRealtime(propsIsRealtime: MaybeRef<boolean>) {
  const settingsStore = useSettingsStore()

  return propsIsRealtime !== undefined ? propsIsRealtime : settingsStore.isRealtimePrograms
}

export function useCurrentProgramPercent(currentProgram: MaybeRef<ProgramEvent | null | undefined>, isRealtime?: MaybeRef<boolean>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgramPercent = computed(() => {
    const percents = (100 / (useDayJS()(toValue(currentProgram)?.scheduledFor.end).diff(useDayJS()(toValue(currentProgram)?.scheduledFor.begin)) / reactiveProgramsCurrTime.currentTime.value.diff(useDayJS()(toValue(currentProgram)?.scheduledFor.begin))))

    return Math.floor(percents * 100) / 100
  })

  return currentProgramPercent
}

export function useChannelPrograms(channelId: ChannelID, channelsPrograms: MaybeRef<ChannelsPrograms | null>) {
  const channelPrograms = computed(() => {
    return toValue(channelsPrograms)?.find(program => program.channelId === channelId) // I AM FUCKED MY MIND ABOUT 2 HOURS WITHOUT THESE `!`.
  })

  return channelPrograms
}

export function getCurrentProgram(programs: ProgramEvent[], currentTime: Dayjs) {
  return programs.find(program => isCurrentProgram(program.scheduledFor, currentTime))
}

export function useCurrentProgram(channelPrograms: MaybeRef<ChannelPrograms['programs'] | APIEPGPageWithEvents['events'] | undefined>, isRealtime?: MaybeRef<boolean>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgram = computed(() => {
    const channelProgramsValue = toValue(channelPrograms)
    if (channelProgramsValue && channelProgramsValue.length > 0) {
      return getCurrentProgram(channelProgramsValue, reactiveProgramsCurrTime.currentTime.value)
    }
    else {
      return null
    }
  })

  return currentProgram
}
