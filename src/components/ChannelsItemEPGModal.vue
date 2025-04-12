<script lang="ts" setup>
import type { Channel } from '~/types'
import { useChannelEPG } from '~/api/epg'

const props = defineProps<{
  channel: Channel
}>()

const showEPG = defineModel<boolean>()

const epg = useChannelEPG(props.channel.id)
</script>

<template>
  <ModalLongScroll v-model="showEPG" :heading="`Программа '${props.channel.title}'`">
    <div v-if="epg.filteredEpg.value">
      <Programs
        :channel-programs="{
          channelId: props.channel.id,
          scheduleId: '0',
          programs: epg.filteredEpg.value,
        }"
        :show-all="true"
        :show-date="true"
        :dont-limit-width="true"
      />
    </div>
  </ModalLongScroll>
</template>

<style scoped>

</style>
