<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { ChannelPrograms, TimeInterval } from '~/types'
import { useCurrentProgram, useCurrentProgramPercent, useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, useDayJS } from '~/shared'

interface Props {
  channelPrograms: ChannelPrograms
  showAll?: boolean
  showDate?: boolean
  showProgress?: boolean
  isRealtime?: boolean
  dontLimitWidth?: boolean
}

const { showAll = false, showDate = false, showProgress = false, isRealtime = false, dontLimitWidth = false, ...props } = defineProps<Props>()

const isRealtimeRef = computed(() => isRealtime)

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtimeRef)

const programs = props.channelPrograms

const filteredPrograms = computed(() => {
  const currentProgramIndex = programs?.programs?.findIndex(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value)) || 0

  return { ...programs, programs: showAll ? programs.programs : [programs?.programs?.[currentProgramIndex], programs?.programs?.[currentProgramIndex + 1]] }
})

function getTimeTo(scheduledFor: TimeInterval, timeToBegin: boolean, currentTime: Dayjs) {
  const timeFormatted = currentTime.to(useDayJS()(scheduledFor[timeToBegin ? 'begin' : 'end']))
  const timeFormattedFirstSymbol = timeFormatted[0].toLocaleUpperCase()

  return timeFormattedFirstSymbol + timeFormatted.slice(1)
}

const currentProgram = useCurrentProgram(filteredPrograms, isRealtimeRef)

const currentProgramPercent = useCurrentProgramPercent(currentProgram, isRealtimeRef)
</script>

<template>
  <ul v-if="props?.channelPrograms?.programs?.length && props?.channelPrograms?.programs?.length > 0 && filteredPrograms.programs.length > 0" class="w-full 2xl:text-xl max-md:(flex flex-col gap-4)">
    <template v-for="program in filteredPrograms.programs">
      <template v-if="program">
        <li :key="program.id + props.channelPrograms.channelId" class="flex gap-2 gap-y-0 relative max-md:flex-wrap" :class="{ 'max-w-3xl 2xl:max-w-4xl': !dontLimitWidth }">
          <span v-if="showDate" class="font-semibold whitespace-nowrap"> <span>{{ useDayJS()(program.scheduledFor.begin).format('YYYY.MM.DD') }}</span> <span>{{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }}</span> - </span>
          <span v-else class="font-semibold whitespace-nowrap"> <span>{{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }}</span> / <span>{{ useDayJS()(program.scheduledFor.end).format('HH:mm') }}</span> - </span>
          <span class="text-brand-600 dark:text-brand-300">{{ program.title }}</span>
          <span class="grow" />
          <span class="mb-0.5 pl-2 whitespace-nowrap md:self-center"> <span class="md:hidden">|||||</span> <span>{{ `${getTimeTo(program.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value)}` }}</span></span>

          <div
            v-if="showProgress && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
            class="bg-brand-900/20 bottom-0 left-0 right-0 absolute dark:bg-brand-100"
          >
            <div class="border-0 border-b-2 border-b-brand-500 border-solid" :style="{ width: `${isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value) ? currentProgramPercent : 0}%` }" />
          </div>
        </li>
      </template>
    </template>
  </ul>
</template>

<style scoped>

</style>
