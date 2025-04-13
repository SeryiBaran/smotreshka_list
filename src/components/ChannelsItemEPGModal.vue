<script lang="ts" setup>
import type { Channel } from '~/types'
import { useChannelEPG } from '~/api/epg'

const props = defineProps<{
  channel: Channel
}>()

const showEPG = defineModel<boolean>()

const epg = useChannelEPG(props.channel.id)

const [showPreviousEpg, toggleShowPreviousEpg] = useToggle(false)
</script>

<template>
  <ModalLongScroll v-model="showEPG" :heading="`Программа '${props.channel.title}'`">
    <div v-if="epg.isEpg.value && !epg.isFetching.value">
      <ChannelsItemEPGModalPrograms :channel="props.channel" :epg :is-next="true" />

      <!-- TODO: Create collapse with @formkit/auto-animate/vue -->
      <button class="header2 flex gap-1 w-full cursor-pointer" @click="toggleShowPreviousEpg()">
        <span class="i-carbon:chevron-right text-inherit" :class="{ previousIcon: showPreviousEpg }" />
        Предыдущие
      </button>

      <ChannelsItemEPGModalPrograms v-if="showPreviousEpg" :channel="props.channel" :epg :is-next="false" />
    </div>
    <p v-else-if="epg.isFetching" class="text-brand-500">
      Загрузка, пожалуйста, подождите...
    </p>
  </ModalLongScroll>
</template>

<style scoped>
.previousIcon {
  transform: rotate(90deg);
}
</style>
