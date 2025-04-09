<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { ChannelPrograms, TimeInterval } from '~/types'
import { useCurrentProgram, useCurrentProgramPercent, useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, useDayJS } from '~/shared'

// TODO
const props = defineProps<Props>()

interface Props {
  channelPrograms: ChannelPrograms
}

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

const programs = props.channelPrograms

const filteredPrograms = computed(() => {
  const currentProgramIndex = programs?.programs?.findIndex(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value)) || 0

  return { ...programs, programs: [programs?.programs?.[currentProgramIndex], programs?.programs?.[currentProgramIndex + 1]] }
})

function getTimeTo(scheduledFor: TimeInterval, timeToBegin: boolean, currentTime: Dayjs) {
  const timeFormatted = currentTime.to(useDayJS()(scheduledFor[timeToBegin ? 'begin' : 'end']))
  const timeFormattedFirstSymbol = timeFormatted[0].toLocaleUpperCase()

  return timeFormattedFirstSymbol + timeFormatted.slice(1)
}

const currentProgram = useCurrentProgram(filteredPrograms)

const currentProgramPercent = useCurrentProgramPercent(currentProgram)
</script>

<template>
  <ul v-if="props?.channelPrograms?.programs?.length && props?.channelPrograms?.programs?.length > 0 && filteredPrograms.programs.length > 0" class="w-full 2xl:text-xl max-md:(flex flex-col gap-4)">
    <template v-for="program in filteredPrograms.programs">
      <template v-if="program">
        <li :key="program.id + props.channelPrograms.channelId" class="flex gap-2 gap-y-0 max-w-3xl relative max-md:flex-wrap 2xl:max-w-4xl">
          <span class="font-semibold whitespace-nowrap"><span>{{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }}</span> / <span>{{ useDayJS()(program.scheduledFor.end).format('HH:mm') }}</span> - </span>
          <span class="text-brand-600 dark:text-brand-300">{{ program.title }}</span>
          <span class="grow" />
          <span class="mb-0.5 pl-2 whitespace-nowrap md:self-center"> <span class="md:hidden">|||||</span> <span>{{ `${getTimeTo(program.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value)}` }}</span></span>

          <div
            v-if="currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
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
