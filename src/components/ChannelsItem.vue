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

const ChannelsItemEPGModal = defineAsyncComponent(() => import('~/components/ChannelsItemEPGModal.vue'))

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

const modalId = `epg__${props.channel.id}`

const modalIsActive = computed(() => modalStore.getIsActive(modalId))

function handleShowEPG() {
  modalStore.setOrToggleModal(modalId, true)
}

const item = useTemplateRef<HTMLLIElement>('item')
const itemWasVisible = ref(false)
const itemIsVisible = useElementVisibility(item, {
  rootMargin: '0px 0px 1024px 0px',
})

watch(itemIsVisible, (newValue) => {
  if (newValue)
    itemWasVisible.value = true
})
</script>

<template>
  <li ref="item" :data-modalid="modalId" class="channelsItem flex" :class="{ isCompactMode: (settingsStore.channelsListMode === 'compact'), isLogosMode: (settingsStore.channelsListMode === 'logos'), notShowPrograms: !settingsStore.isShowPrograms }">
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
      <div v-if="settingsStore.channelsListMode !== 'logos'" class="channelsItemInfoWrapper wrapper w-full">
        <div class="channelTitle limitWidth flex gap-5 items-center">
          <span class="channelNumber">{{ formatKeyNumber(props.channel.keyNumber) }}</span>
          <span class="channelName">{{ props.channel.title }}</span>
          <span class="channelBtns">
            <button class="colorsTransition btn-icon channelBtn showEpgBtn" title="Открыть программу передач" @click.prevent="handleShowEPG()">
              <span class="colorsTransition i-tabler:list text-4 block 2xl:text-6" />
            </button>
            <button
              class="colorsTransition btn-icon channelBtn" :class="{ 'btn-icon-checked': settingsStore.favoriteChannels.includes(props.channel.id),
              }" title="Добавить в локал избранное"
              @click.prevent="settingsStore.favoriteChannelToggle(props.channel.id)"
            >
              <span
                class="colorsTransition i-tabler:heart text-4 block 2xl:text-6" :class="{ 'i-tabler:heart-filled': settingsStore.favoriteChannels.includes(props.channel.id),
                }"
              />
            </button>
          </span>
        </div>
        <template v-if="(settingsStore.channelsListMode !== 'compact') && settingsStore.isShowPrograms">
          <!-- TODO: figure, why this <Programs> lag, but <Programs> in modal not lags -->
          <!-- TODO: 'Загрузка программы, подождите пожалуйста...' lags and stays 3-5 seconds on phones and devices with low performance -->
          <!-- TODO: Or/and make virtual scroll -->
          <!-- TODO: https://vuejs.org/guide/best-practices/performance.html -->
          <!-- TODO: fix what nex and prev is indentical -->
          <Programs
            v-if="itemWasVisible && props.channelsPrograms && channelPrograms !== undefined && currentProgram"
            :channel-programs="channelPrograms"
            :show-progress="true"
            class="mt-2 2xl:mt-4"
            :is-realtime="settingsStore.isRealtimePrograms"
          />
          <p v-else class="text-sm mt-2">
            <!-- {{ props.isProgramsFetching ? 'Загрузка программы, подождите пожалуйста...' : 'Простите, программа отсутствует. Попробуйте нажать на кнопку слева.' }} -->
            Загрузка программы, подождите пожалуйста...
          </p>
        </template>
      </div>
    </a>
    <!-- TODO: v-if="modalIsActive" optimizes performance and prevents smotreshka DDoS with 200+ fetch, but lost animation on modal exit -->
    <ChannelsItemEPGModal
      v-if="modalIsActive"
      :data-modalid="modalId"
      :model-value="modalIsActive"
      :channel="props.channel"
      @update:model-value="val => modalStore.setOrToggleModal(modalId, val)"
    />
  </li>
</template>

<style scoped>
a.channelLink {
  @apply border border-2 border-transparent rounded-3 hover:border-brand-500 hover:bg-brand-500/15 hover:dark:bg-brand-500/12 p-4 flex gap-4 xl:gap-8 h-full w-full overflow-hidden;
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
  @apply text-3xl 2xl:text-5xl text-brand-800 font-semibold dark:text-brand-300;
}

.channelName {
  @apply text-2xl 2xl:text-4xl;
}

.notShowPrograms .channelsItemInfoWrapper {
  @apply flex items-center;
}

.notShowPrograms .channelNumber {
  @apply md:text-5xl 2xl:text-6xl;
}

.notShowPrograms .channelName {
  @apply md:text-4xl 2xl:text-5xl;
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
  @apply bg-brand-200 text-white absolute bottom-0 left-0 right-0 transition transition-property-[transform,opacity] transition-duration-150ms;
  transform: translateX(100%);
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
  transform: translateX(0%);
  opacity: 100;
}

.channelBtns {
  @apply flex gap-1 ml-auto flex-col sm:flex-row;
}

.channelLink .channelBtn {
  @apply border border-transparent;
}

.channelLink:hover .channelBtn {
  @apply border-brand-600/20;
}
</style>
