<script lang="ts" setup>
import type { APIProgramsComposeTable, Channel, ChannelsPrograms } from '~/types'

import { useChannelPrograms, useCurrentProgram, useCurrentProgramPercent, useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, makeChannelPlayLink } from '~/shared'
import { useModalStore } from '~/store/modal'
import { useSettingsStore } from '~/store/settings'

interface Props {
  channel: Channel
  channelsPrograms: Ref<ChannelsPrograms | null>
  isProgramsFetching: boolean
  programsComposeTable: APIProgramsComposeTable | undefined
}

const props = defineProps<Props>()

const settingsStore = useSettingsStore()
const modalStore = useModalStore()

const minMd = useMediaQuery('(min-width: 832px)') // to hide images, and to disable loading of big icons on small devices

function formatKeyNumber(keyNumber: number) {
  return keyNumber.toString().padStart(3, '0')
}

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

const channelPrograms = useChannelPrograms(props.channel.id, props.channelsPrograms)

const programs = computed(() => channelPrograms.value?.programs)

const currentProgram = useCurrentProgram(programs)

const currentProgramPercent = useCurrentProgramPercent(currentProgram)

const chLogoOverlayMainStyle = computed(() => ({
  backgroundImage: currentProgram.value?.logoUrl ? `url('${currentProgram.value.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93')` : '',
  backgroundSize: 'cover',
}))

const showEPG = ref<boolean>(false)

function handleShowEPG() {
  const newValue = !showEPG.value
  showEPG.value = newValue
}

watch(showEPG, (newShowEPG) => {
  modalStore.openedModalsSetOrToggle('epg', newShowEPG)
})

const item = useTemplateRef<HTMLLIElement>('li')
const itemIsVisible = useElementVisibility(item)
</script>

<template>
  <li ref="li" class="flex" :class="{ isCompactMode: (settingsStore.channelsListMode === 'compact'), isLogosMode: (settingsStore.channelsListMode === 'logos') }">
    <button v-if="settingsStore.channelsListMode !== 'logos'" class="showEpgBtn colorsTransition btn btn-with-icon" @click="() => handleShowEPG()">
      <span class="transitionColors i-tabler:list text-4 block 2xl:text-6" />
    </button>
    <a :href="makeChannelPlayLink(props.channel.id)" class="channelLink" :target="settingsStore.isOpenNewTab ? '_blank' : '_top'">
      <div v-if="(minMd && settingsStore.isShowChannelsImages && !(settingsStore.channelsListMode === 'compact')) || settingsStore.channelsListMode === 'logos'" class="chLogoContainer">
        <img class="chLogo" :src="`${props.channel.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93`" :alt="`Иконка ${formatKeyNumber(props.channel.keyNumber)} ${props.channel.title}`">
        <div
          v-if="settingsStore.isShowInfoOnHover && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
          class="chLogoOverlayCommon chLogoOverlayMain"
          :style="chLogoOverlayMainStyle"
        >
          <div v-if="settingsStore.channelsListMode === 'logos'" class="bg-neutral-900/60 h-full">
            <p class="chLogoOverlayMainChannelTitle"><span class="text-brand-500">{{ formatKeyNumber(channel.keyNumber) }}</span> {{ channel.title }}</p>
            <p class="text-sm leading-4 px-2.5 py-1.8">{{ currentProgram.title }}</p>
          </div>
        </div>

        <div
          v-if="settingsStore.isShowInfoOnHover && settingsStore.channelsListMode === 'logos' && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
          class="chLogoOverlayCommon chLogoOverlayProgress"
        >
          <div class="chLogoOverlayProgressSlider" :style="{ width: `${currentProgramPercent}%` }" />
        </div>
      </div>
      <div v-if="settingsStore.channelsListMode !== 'logos'" class="wrapper w-full">
        <div class="channelTitle flex gap-5 items-center">
          <span class="channelNumber">{{ formatKeyNumber(props.channel.keyNumber) }}</span>
          <span class="channelName text-2xl 2xl:text-4xl">{{ props.channel.title }}</span>
        </div>
        <template v-if="(settingsStore.channelsListMode !== 'compact') && settingsStore.isShowPrograms">
          <!-- TODO: figure, why this <Programs> lag, but <Programs> in modal not lags -->
          <Programs
            v-if="itemIsVisible && props.channelsPrograms && channelPrograms !== undefined && currentProgram"
            :channel-programs="channelPrograms"
            :show-progress="true"
            class="mt-2 2xl:mt-4"
            :is-realtime="settingsStore.isRealtimePrograms"
          />
          <p v-else class="text-sm mt-2">
            {{ props.isProgramsFetching ? 'Загрузка программы, подождите пожалуйста...' : 'Простите, программа отсутствует. Попробуйте нажать на кнопку слева.' }}
          </p>
        </template>
      </div>
    </a>
    <!-- TODO: v-if="showEPG" optimizes performance and prevents smotreshka DDoS with 200+ fetch, but lost animation on modal exit -->
    <ChannelsItemEPGModal v-if="showEPG" v-model="showEPG" :channel="props.channel" />
  </li>
</template>

<style scoped>
a.channelLink {
  @apply border border-2 border-transparent rounded-3 hover:border-brand-500 hover:bg-brand-500/15 hover:dark:bg-brand-500/12 p-4 flex gap-4 h-full w-full overflow-hidden;
}

li.isCompactMode {
  @apply rounded-1;
}

li.isCompactMode a {
  @apply px-1.5 py-0.5 gap-1.5;
}

li.isCompactMode .chLogo {
  @apply rounded-2 w-10; /* LAGGY! */
}

li.isCompactMode .wrapper {
  @apply flex gap-1.5 justify-between max-w-3xl;
}

li.isCompactMode .channelTitle {
  @apply gap-1.5 items-start;
}

.channelNumber {
  @apply text-3xl text-brand-800 font-semibold 2xl:text-5xl dark:text-brand-300;
}

li.isCompactMode .channelNumber {
  @apply text-xl;
}

li.isCompactMode .channelName {
  @apply text-size-base mt-0.5;
}

/* oh shit */

li.isLogosMode {
  @apply p-0 overflow-hidden;
}

li.isLogosMode a {
  @apply p-0;
}

.chLogoContainer {
  @apply overflow-hidden border border-1 border-brand-500 rounded-3 w-50 aspect-video transform self-start relative object-cover 2xl:w-65;
}

li.isLogosMode .chLogoContainer {
  @apply w-full rounded-0 border-0;
}

.chLogoOverlayCommon {
  @apply bg-brand-200 text-white absolute bottom-0 left-0 right-0;
  opacity: 0;
}

.chLogoOverlayMain {
  @apply top-0;
}

.chLogoOverlayMainChannelTitle {
  @apply font-semibold leading-4 px-2.5 py-1.8 border-0 border-b-1 border-brand-500 border-solid;
}

.chLogoOverlayProgress {
  @apply border-0 border-t-1 border-t-brand-900;
}

.chLogoOverlayProgress .chLogoOverlayProgressSlider {
  @apply border-0 border-b-4 border-b-brand-500;
}

a:hover .chLogoContainer .chLogoOverlayCommon {
  opacity: 100;
}

.showEpgBtn {
  @apply my-1 p-1;
}
</style>
