<script lang="ts" setup>
import type { ChannelPrograms, TimeInterval } from '~/types'
import { useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, useDayJS } from '~/shared'

// TODO
const props = defineProps<Props>()

interface Props {
  channelPrograms: ChannelPrograms
}

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

const programs = props.channelPrograms.programs

const filteredPrograms = computed(() => {
  const currentProgramIndex = programs?.findIndex(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value)) || 0

  return [programs?.[currentProgramIndex], programs?.[currentProgramIndex + 1]]
})

function getTimeTo(scheduledFor: TimeInterval, timeToBegin: boolean) {
  const timeFormatted = reactiveProgramsCurrTime.currentTime.value.to(useDayJS()(scheduledFor[timeToBegin ? 'begin' : 'end']))
  const timeFormattedFirstSymbol = timeFormatted[0].toLocaleUpperCase()

  return timeFormattedFirstSymbol + timeFormatted.slice(1)
}
</script>

<template>
  <ul v-if="props?.channelPrograms?.programs?.length && props?.channelPrograms?.programs?.length > 0 && filteredPrograms.length > 0" class="w-full 2xl:text-xl max-md:(flex flex-col gap-4)">
    <li v-for="program in filteredPrograms" :key="program.id" class="flex gap-2 gap-y-0 max-w-3xl max-md:flex-wrap 2xl:max-w-4xl">
      <span class="font-semibold whitespace-nowrap"><span>{{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }}</span> / <span>{{ useDayJS()(program.scheduledFor.end).format('HH:mm') }}</span> - </span>
      <span class="text-brand-600 dark:text-brand-300">{{ program.title }}</span>
      <span class="border-0 border-solid grow self-center md:border-t-2 max-md:hidden" />
      <span class="pl-2 whitespace-nowrap md:self-center"> <span class="md:hidden">|||||</span> <span>{{ `${getTimeTo(program.scheduledFor, isCurrentProgram(program.scheduledFor))}` }}</span></span>
    </li>
  </ul>
</template>

<style scoped>

</style>
