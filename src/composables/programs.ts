import type { Dayjs } from 'dayjs'
import type { ChannelPrograms, ProgramEvent } from '~/types'
import { isCurrentProgram, useDayJS } from '~/shared'

const currentTime = ref<Dayjs>(useDayJS()())

const timeout = useTimeoutFn(() => {
  currentTime.value = useDayJS()()

  timeout.start()
}, 10000)

timeout.start()

export function useReactiveProgramsCurrTime(isRealtime?: Ref<boolean>) {
  let returnedCurrentTime: Ref<Dayjs> | Dayjs

  if ((isRealtime && isRealtime.value) || (isRealtime === undefined)) {
    returnedCurrentTime = computed(() => currentTime.value)
  }
  else {
    returnedCurrentTime = ref(useDayJS()())
  }

  return { currentTime: returnedCurrentTime, timeout }
}

export function useCurrentProgramPercent(currentProgram: Ref<ProgramEvent | null | undefined>, isRealtime?: Ref<boolean>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgramPercent = computed(() => {
    const percents = (100 / (useDayJS()(currentProgram.value?.scheduledFor.end).diff(useDayJS()(currentProgram.value?.scheduledFor.begin)) / reactiveProgramsCurrTime.currentTime.value.diff(useDayJS()(currentProgram.value?.scheduledFor.begin))))

    return Math.floor(percents * 100) / 100
  })

  return currentProgramPercent
}

export function useCurrentProgram(channelPrograms: Ref<ChannelPrograms>, isRealtime?: Ref<boolean>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

  const currentProgram = computed(() => {
    if (channelPrograms.value) {
      return channelPrograms.value.programs.find(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value))
    }
    else {
      return null
    }
  })

  return currentProgram
}
