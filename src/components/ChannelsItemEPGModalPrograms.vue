<script lang="ts" setup>
import type { useChannelEPG } from '~/api/epg'
import type { Channel } from '~/types'

const props = defineProps<{
  channel: Channel
  epg: ReturnType<typeof useChannelEPG>
  isNext: boolean
}>()
</script>

<template>
  <Programs
    :channel-programs="{
      channelId: props.channel.id,
      scheduleId: '0',
      programs: props.epg.filteredEpg[props.isNext ? 'next' : 'previous'].value,
    }"
    :show-all="true" :show-date="true" :dont-limit-width="true"
  />
</template>

<style scoped>

</style>
