<script lang="ts" setup>
import type { useChannelEPG } from '~/api/epg'
import type { ChannelID } from '~/types'

const props = defineProps<{
  channelId: ChannelID
  epg: ReturnType<typeof useChannelEPG>
  filteredEpg: ReturnType<typeof useChannelEPG>['filteredEpg']
  isNext: boolean
}>()

const currentProgram = useCurrentProgram(props.epg.epg)

const programs = computed(() => {
  const otherPrograms = props.filteredEpg[props.isNext ? 'next' : 'previous']

  return {
    channelId: props.channelId,
    scheduleId: '0',
    programs: props.isNext && currentProgram.value ? [currentProgram.value, ...otherPrograms.value] : otherPrograms.value,
  }
})
</script>

<template>
  <p v-for="(a, i) in props.filteredEpg.next.value.slice(0, 2) " :key="a.id" class="mb-10">
    filteredEpg.next.slice(0, 2) {{ i }} {{ a.title }}
  </p>
  <p class="mb-10">
    current is {{ currentProgram?.title }}
  </p>
  <p v-for="(a, i) in programs.programs.slice(0, 2) " :key="a.id" class="mb-10">
    programs.slice(0, 2) {{ i }} {{ a.title }}
  </p>
  <Programs
    :channel-programs="programs"
    :show-all="true" :show-date="true" :dont-limit-width="true" :show-description="true"
  />
</template>

<style scoped>

</style>
