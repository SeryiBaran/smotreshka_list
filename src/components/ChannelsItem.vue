<script lang="ts" setup>
import type { Channel, ChannelsPrograms } from '~/types'
import { useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, makeChannelPlayLink, useDayJS } from '~/shared'
import { useSettingsStore } from '~/store/settings'

interface Props {
  channel: Channel
  channelsPrograms: ChannelsPrograms | null
  isProgramsFetching: boolean
}

const props = defineProps<Props>()

const settingsStore = useSettingsStore()

const minMd = useMediaQuery('(min-width: 832px)') // to hide images, and to disable loading of big icons on small devices

function formatKeyNumber(keyNumber: number) {
  return keyNumber.toString().padStart(3, '0')
}

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

const channelPrograms = computed(() => {
  return props.channelsPrograms!.find(channelPrograms => channelPrograms?.channelId === props.channel.id)! // I AM FUCKED MY MIND ABOUT 2 HOURS WITHOUT THESE `!`.
})

const currentProgram = computed(() => {
  if (channelPrograms.value) {
    return channelPrograms.value.programs.find(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value))
  }
  else {
    return null
  }
})

const currentProgramPercent = computed(() => {
  const percents = (100 / (useDayJS()(currentProgram.value?.scheduledFor.end).diff(useDayJS()(currentProgram.value?.scheduledFor.begin)) / reactiveProgramsCurrTime.currentTime.value.diff(useDayJS()(currentProgram.value?.scheduledFor.begin))))

  return Math.floor(percents * 100) / 100
})
</script>

<template>
  <li class="border border-2 border-transparent rounded-3 hover:border-brand-500 hover:bg-brand-500/15 hover:dark:bg-brand-500/12" :class="{ isCompactMode: (settingsStore.channelsListMode === 'compact'), isLogosMode: (settingsStore.channelsListMode === 'logos') }">
    <a :href="makeChannelPlayLink(props.channel.id)" class="p-4 flex gap-4 h-full" :target="settingsStore.isOpenNewTab ? '_blank' : '_top'">
      <div v-if="(minMd && settingsStore.isShowChannelsImages && !(settingsStore.channelsListMode === 'compact')) || settingsStore.channelsListMode === 'logos'" class="channelLogoContainer border border-1 border-brand-500 rounded-3 w-50 aspect-video transform self-start relative object-cover 2xl:w-65">
        <img class="channelLogo w-full" :src="`${props.channel.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93`" :alt="`Иконка ${formatKeyNumber(props.channel.keyNumber)} ${props.channel.title}`">
        <div
          class="channelLogoOverlay text-white bottom-0 left-0 right-0 top-0 absolute"
          :style="{
            backgroundImage: `url('${currentProgram?.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93')`,
            backgroundSize: 'cover',
          }"
        >
          <div v-if="settingsStore.channelsListMode === 'logos'" class="bg-neutral-900/60 h-full">
            <p class="font-semibold leading-4 px-2.5 py-1.8 border-0 border-b-1 border-brand-500 border-solid"><span class="text-brand-500">{{ formatKeyNumber(channel.keyNumber) }}</span> {{ channel.title }}</p>
            <p class="text-sm leading-4 px-2.5 py-1.8">{{ currentProgram?.title }}</p>
          </div>
        </div>

        <div
          class="channelLogoOverlay border-0 border-t-1 border-t-brand-900 border-solid bg-brand-100 bottom-0 left-0 right-0 absolute"
        >
          <div class="border-0 border-b-4 border-b-brand-500 border-solid" :style="{ width: `${currentProgramPercent}%` }" />
        </div>
      </div>
      <div v-if="settingsStore.channelsListMode !== 'logos'" class="wrapper w-full">
        <div class="channelTitle flex gap-5 items-center">
          <span class="channelNumber text-3xl text-brand-800 font-semibold 2xl:text-5xl dark:text-brand-300">{{ formatKeyNumber(props.channel.keyNumber) }}</span>
          <span class="channelName text-2xl 2xl:text-4xl">{{ props.channel.title }}</span>
        </div>
        <Programs v-if="!(settingsStore.channelsListMode === 'compact') && settingsStore.isShowPrograms && props.channelsPrograms && channelPrograms !== undefined" :channel-programs="channelPrograms" class="mt-2 2xl:mt-4" />
        <p v-else-if="settingsStore.isShowPrograms && !(settingsStore.channelsListMode === 'compact')" class="text-sm mt-2">
          <!-- {{ `${channel.description.slice(0, 200)}...` }} -->
          {{ props.isProgramsFetching ? 'Загрузка программы, подождите пожалуйста...' : 'Простите, программа отсутствует' }}
        </p>
        <!-- <p v-else-if="(settingsStore.channelsListMode === 'compact') && channelPrograms" class="text-sm">
          {{ currentProgram?.title.slice(0, 40) }}
        </p> -->
      </div>
    </a>
  </li>
</template>

<style scoped>
li.isCompactMode {
  @apply rounded-1;
}

.isCompactMode a {
  @apply px-1.5 py-0.5 gap-1.5;
}

.isCompactMode .channelLogo {
  @apply rounded-2 w-10; /* LAGGY! */
}

.isCompactMode .wrapper {
  @apply flex gap-1.5 justify-between max-w-3xl;
}

.isCompactMode .channelTitle {
  @apply gap-1.5 items-start;
}

.isCompactMode .channelNumber {
  @apply text-xl;
}

.isCompactMode .channelName {
  @apply text-size-base mt-0.5;
}

/* oh shit */

li.isLogosMode {
  @apply p-0 overflow-hidden;
}

.isLogosMode a {
  @apply p-0;
}

.channelLogoContainer {
  @apply overflow-hidden;
}

.isLogosMode .channelLogoContainer {
  @apply w-full rounded-0 border-0;
}

.channelLogoOverlay {
  opacity: 0;
}

li:hover .channelLogoContainer .channelLogoOverlay {
  opacity: 100;
}
</style>
