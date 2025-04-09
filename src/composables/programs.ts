import type { Dayjs } from 'dayjs'
import type { ChannelPrograms, ProgramEvent } from '~/types'
import { isCurrentProgram, useDayJS } from '~/shared'

export function useReactiveProgramsCurrTime() {
  const currentTime = ref<Dayjs>(useDayJS()())

  const timeout = useTimeoutFn(() => {
    currentTime.value = useDayJS()()

    timeout.start()
  }, 10000)

  timeout.start()

  return { currentTime, timeout }
}

export function useCurrentProgramPercent(currentProgram: Ref<ProgramEvent | null | undefined>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

  const currentProgramPercent = computed(() => {
    const percents = (100 / (useDayJS()(currentProgram.value?.scheduledFor.end).diff(useDayJS()(currentProgram.value?.scheduledFor.begin)) / reactiveProgramsCurrTime.currentTime.value.diff(useDayJS()(currentProgram.value?.scheduledFor.begin))))

    return Math.floor(percents * 100) / 100
  })

  return currentProgramPercent
}

export function useCurrentProgram(channelPrograms: Ref<ChannelPrograms>) {
  const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

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
