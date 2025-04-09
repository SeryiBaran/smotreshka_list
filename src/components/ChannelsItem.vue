<script lang="ts" setup>
import type { APIEPG, APIEPGEvent, APIProgramsComposeTable, Channel, ChannelsPrograms } from '~/types'

import { useCurrentProgram, useCurrentProgramPercent, useReactiveProgramsCurrTime } from '~/composables/programs'
import { isCurrentProgram, makeChannelPlayLink, useDayJS } from '~/shared'
import { useModalStore } from '~/store/modal'
import { useSettingsStore } from '~/store/settings'

interface Props {
  channel: Channel
  channelsPrograms: ChannelsPrograms | null
  isProgramsFetching: boolean
  programsComposeTableFetch: APIProgramsComposeTable | null
}

const props = defineProps<Props>()

const settingsStore = useSettingsStore()
const modalStore = useModalStore()

const minMd = useMediaQuery('(min-width: 832px)') // to hide images, and to disable loading of big icons on small devices

function formatKeyNumber(keyNumber: number) {
  return keyNumber.toString().padStart(3, '0')
}

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime()

const channelPrograms = computed(() => {
  return props.channelsPrograms!.find(channelPrograms => channelPrograms?.channelId === props.channel.id)! // I AM FUCKED MY MIND ABOUT 2 HOURS WITHOUT THESE `!`.
})

const currentProgram = useCurrentProgram(channelPrograms)

const currentProgramPercent = useCurrentProgramPercent(currentProgram)

const todaySchedule = computed(() => {
  const findResult = props.programsComposeTableFetch?.medias.find(media => media.channelId === props.channel.id)

  if (findResult) {
    return findResult.scheduleId
  }

  return null
})

const epgUrlTime = useDayJS()().utc()

const epgUrl = computed(() => `https://fe.smotreshka.tv/epg/v2/schedules/${todaySchedule.value}/spread?centralPageId=${epgUrlTime.format(`YYYY-MM-DD[t]12[d]12[h]`)}`)

const epgFetch = useFetch(epgUrl, {
  immediate: false,
}).get().json<APIEPG>()

const showEPG = ref<boolean>(false)

function handleFetchEPG() {
  const newValue = !showEPG.value
  showEPG.value = newValue

  if (newValue)
    epgFetch.execute()
}

const filteredEpg = computed(() => epgFetch.data.value?.pagesWithEvents.reduce<APIEPGEvent[]>((acc, page) => [...acc, ...page.events], []).filter(event => useDayJS()().isBefore(useDayJS()(event.scheduledFor.begin))))

watch(showEPG, (newShowEPG) => {
  modalStore.openedModalsSetOrToggle('epg', newShowEPG)
})
</script>

<template>
  <li class="flex" :class="{ isCompactMode: (settingsStore.channelsListMode === 'compact'), isLogosMode: (settingsStore.channelsListMode === 'logos') }">
    <button v-if="settingsStore.channelsListMode !== 'logos'" class="showEpgBtn colorsTransition btn btn-with-icon" :disabled="epgFetch.isFetching.value" @click="() => handleFetchEPG()">
      <span class="transitionColors i-tabler:list text-4 block" />
    </button>
    <a :href="makeChannelPlayLink(props.channel.id)" class="p-4 flex gap-4 h-full w-full overflow-hidden" :target="settingsStore.isOpenNewTab ? '_blank' : '_top'">
      <div v-if="(minMd && settingsStore.isShowChannelsImages && !(settingsStore.channelsListMode === 'compact')) || settingsStore.channelsListMode === 'logos'" class="channelLogoContainer">
        <img class="channelLogo w-full" :src="`${props.channel.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93`" :alt="`Иконка ${formatKeyNumber(props.channel.keyNumber)} ${props.channel.title}`">
        <div
          v-if="settingsStore.isShowInfoOnHover && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
          class="channelLogoOverlay text-white bottom-0 left-0 right-0 top-0 absolute"
          :style="{
            backgroundImage: currentProgram?.logoUrl ? `url('${currentProgram.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93')` : '',
            backgroundSize: 'cover',
          }"
        >
          <div v-if="settingsStore.channelsListMode === 'logos'" class="bg-neutral-900/60 h-full">
            <p class="font-semibold leading-4 px-2.5 py-1.8 border-0 border-b-1 border-brand-500 border-solid"><span class="text-brand-500">{{ formatKeyNumber(channel.keyNumber) }}</span> {{ channel.title }}</p>
            <p class="text-sm leading-4 px-2.5 py-1.8">{{ currentProgram?.title }}</p>
          </div>
        </div>

        <div
          v-if="settingsStore.isShowInfoOnHover && settingsStore.channelsListMode === 'logos' && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
          class="channelLogoOverlay channelLogoOverlay2"
        >
          <div class="border-0 border-b-4 border-b-brand-500 border-solid" :style="{ width: `${currentProgramPercent}%` }" />
        </div>
      </div>
      <div v-if="settingsStore.channelsListMode !== 'logos'" class="wrapper w-full">
        <div class="channelTitle flex gap-5 items-center">
          <span class="channelNumber text-3xl text-brand-800 font-semibold 2xl:text-5xl dark:text-brand-300">{{ formatKeyNumber(props.channel.keyNumber) }}</span>
          <span class="channelName text-2xl 2xl:text-4xl">{{ props.channel.title }}</span>
        </div>
        <Programs v-if="!(settingsStore.channelsListMode === 'compact') && settingsStore.isShowPrograms && props.channelsPrograms && channelPrograms !== undefined" :channel-programs="channelPrograms" :show-progress="true" class="mt-2 2xl:mt-4" :is-realtime="settingsStore.isRealtimePrograms" />
        <p v-else-if="settingsStore.isShowPrograms && !(settingsStore.channelsListMode === 'compact')" class="text-sm mt-2">
          <!-- {{ `${channel.description.slice(0, 200)}...` }} -->
          {{ props.isProgramsFetching ? 'Загрузка программы, подождите пожалуйста...' : 'Простите, программа отсутствует' }}
        </p>
        <!-- <p v-else-if="(settingsStore.channelsListMode === 'compact') && channelPrograms" class="text-sm">
          {{ currentProgram?.title.slice(0, 40) }}
        </p> -->
      </div>
    </a>
    <ModalLongScroll v-if="showEPG" v-model="showEPG" :heading="`Программа '${props.channel.title}'`">
      <div v-if="filteredEpg">
        <Programs
          :channel-programs="{
            channelId: props.channel.id,
            scheduleId: '0',
            programs: filteredEpg,
          }"
          :show-all="true"
          :show-date="true"
          :dont-limit-width="true"
        />
      </div>
    </ModalLongScroll>
  </li>
</template>

<style scoped>
a {
  @apply border border-2 border-transparent rounded-3 hover:border-brand-500 hover:bg-brand-500/15 hover:dark:bg-brand-500/12;
}

li.isCompactMode {
  @apply rounded-1;
}

li.isCompactMode a {
  @apply px-1.5 py-0.5 gap-1.5;
}

li.isCompactMode .channelLogo {
  @apply rounded-2 w-10; /* LAGGY! */
}

li.isCompactMode .wrapper {
  @apply flex gap-1.5 justify-between max-w-3xl;
}

li.isCompactMode .channelTitle {
  @apply gap-1.5 items-start;
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

.channelLogoContainer {
  @apply overflow-hidden border border-1 border-brand-500 rounded-3 w-50 aspect-video transform self-start relative object-cover 2xl:w-65;
}

li.isLogosMode .channelLogoContainer {
  @apply w-full rounded-0 border-0;
}

.channelLogoOverlay2 {
  @apply border-0 border-t-1 border-t-brand-900 border-solid;
  opacity: 0;
}

.channelLogoOverlay {
  @apply bg-brand-200 bottom-0 left-0 right-0 absolute;
  opacity: 0;
}

a:hover .channelLogoContainer .channelLogoOverlay {
  opacity: 100;
}

.showEpgBtn {
  @apply my-1 p-1;
}
</style>
