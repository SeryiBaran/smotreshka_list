<script lang="ts" setup>
import type { useChannelEPG } from '~/api/epg'
import type { ChannelID } from '~/types'
import { computed } from 'vue'
import { useCurrentProgram } from '~/composables/programs'
import { isCurrentProgram } from '~/shared'

const props = defineProps<{
  channelId: ChannelID
  epg: ReturnType<typeof useChannelEPG>
  filteredEpg: ReturnType<typeof useChannelEPG>['filteredEpg']
  isNext: boolean
}>()

const currentProgram = useCurrentProgram(props.epg.epg)

const programs = computed(() => {
  const otherPrograms = props.filteredEpg[props.isNext ? 'next' : 'previous'].value.filter(program => props.isNext ? true : !isCurrentProgram(program.scheduledFor))

  return {
    channelId: props.channelId,
    scheduleId: '0',
    programs: props.isNext && currentProgram.value ? [currentProgram.value, ...otherPrograms] : otherPrograms,
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
