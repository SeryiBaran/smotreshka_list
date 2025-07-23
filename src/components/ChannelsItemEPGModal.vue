<script lang="ts" setup>
import type { Channel, Keys } from '~/types'
import { useChannelEPG } from '~/api/epg'

const props = defineProps<{
  channel: Channel
}>()

const showEPG = defineModel<boolean>()

const epg = useChannelEPG(props.channel.id)

const channelEpgLink = computed(() => `https://smotreshka.tv/channels/${props.channel.id}/program`)

const groupsNames = {
  previous: 'Предыдущие',
  next: 'Следующие',
}

const groups = Object.keys(groupsNames) as Keys<typeof groupsNames>

const groupsStates = reactive<{ [k in keyof typeof groupsNames]: boolean }>({
  previous: false,
  next: true,
})
</script>

<template>
  <ModalLongScroll v-model="showEPG" :heading="`Программа '${props.channel.title}'`" :channel-epg-link>
    <div v-if="epg.isEpg.value && !epg.isFetching.value">
      <div v-for="group in groups" :key="group" class="my-b-border">
        <!-- TODO: Create collapse with @formkit/auto-animate/vue -->
        <button class="header2 mt-2 flex gap-1 w-full cursor-pointer" :class="[`epgCollapse__${group}`]" @click="groupsStates[group] = !groupsStates[group]">
          <span class="i-carbon:chevron-right text-inherit" :class="{ iconOpened: groupsStates[group] }" />
          {{ groupsNames[group] }}
        </button>

        <ChannelsItemEPGModalPrograms v-if="groupsStates[group]" :channel-id="props.channel.id" :epg :filtered-epg="epg.filteredEpg" :is-next="group === 'next'" />
      </div>
    </div>
    <p v-else-if="epg.isFetching" class="text-brand-500">
      Загрузка, пожалуйста, подождите...
    </p>
  </ModalLongScroll>
</template>

<style scoped>
.iconOpened {
  transform: rotate(90deg);
}
</style>
