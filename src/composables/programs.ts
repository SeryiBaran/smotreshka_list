import type { Dayjs } from 'dayjs'
import { useDayJS } from '~/shared'

export function useReactiveProgramsCurrTime() {
  const currentTime = ref<Dayjs>(useDayJS()())

  const timeout = useTimeoutFn(() => {
    currentTime.value = useDayJS()()

    timeout.start()
  }, 10000)

  timeout.start()

  return { currentTime, timeout }
}
