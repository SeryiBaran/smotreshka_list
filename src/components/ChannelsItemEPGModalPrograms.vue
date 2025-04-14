<script lang="ts" setup>
import type { useChannelEPG } from '~/api/epg'
import type { Channel } from '~/types'

const props = defineProps<{
  channel: Channel
  epg: ReturnType<typeof useChannelEPG>
  isNext: boolean
}>()

const currentProgram = useCurrentProgram(props.epg.epg)

const programs = computed(() => {
  const otherPrograms = props.epg.filteredEpg[props.isNext ? 'next' : 'previous'].value

  return props.isNext && currentProgram.value ? [currentProgram.value, ...otherPrograms] : otherPrograms
})
</script>

<template>
  <Programs
    :channel-programs="{
      channelId: props.channel.id,
      scheduleId: '0',
      programs,
    }"
    :show-all="true" :show-date="true" :dont-limit-width="true" :show-description="true"
  />
</template>

<style scoped>

</style>
