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
  <Programs
    :channel-programs="programs"
    :show-all="true" :show-date="true" :dont-limit-width="true" :show-description="true"
  />
</template>

<style scoped>

</style>
