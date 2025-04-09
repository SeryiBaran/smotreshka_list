<script setup lang="ts">
import type { APIChannels, APIPrograms, APIProgramsComposeTable, GenreID, Values } from '~/types'
import { useFetch } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { storeToRefs } from 'pinia'
import { channelsPacks, log, makeChannelPlayLink, maxTvKeyboardKeyNumberLength, programsRefetchTimeout } from '~/shared'
import { useFiltersStore } from '~/store/filters'
import { useSettingsStore } from '~/store/settings'

defineOptions({
  name: 'IndexPage',
})

const availableChannelsNumbers = (Object.values(channelsPacks) as Values<typeof channelsPacks>)
  .reduce<number[]>((accumulator, e) => ([...accumulator, ...e]), [])

const channelsFetchURL = 'https://fe.smotreshka.tv/tv/v2/channels?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjMsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbIjVlNzlmODI5Y2YxZDlkNWE5MTg4MmYxNyIsIjVmZDM5MDJlZTUwMDA3MGJhZTM5OGI4ZSIsIjYyMzllYjVlMjQ3Mzc4MjM2NmZkMWM2MCJdLCJyZWdpb24iOiJydS5jZW50cmFsLm1vc2NvdyIsImRldmljZV90eXBlIjoicGMiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MiwibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.TOWQtBXKEV1fqKyu_z1wHszfxRM71paqfAwKC38kLnY'

const programsFetchURL = 'https://fe.smotreshka.tv/epg/v2/on-air?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJwaG9uZSIsIm5ldHdvcmtfYWZmaWxpYXRpb25fc3RhdHVzIjozLCJsb2NhbGUiOiJydSIsInByb2ZpbGVfdHlwZSI6MiwicHJvZmlsZV9yZXN0cmljdGlvbl92YWx1ZSI6M30.wB3RTIMXoURTU-j_afc3AIH575HhQMclIE8EMuJ1NSM'

const programsComposeTableFetchURL = 'https://fe.smotreshka.tv/tv/v2/medias?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJ0YWJsZXQiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MywibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.jl_3Bn2iw7GRb7CCsj75XqbjJykPmRa655LBKQly8ds'

const channelsFetch = useFetch(channelsFetchURL, {}).get().json<APIChannels>()
const programsFetch = useFetch(programsFetchURL, {}).get().json<APIPrograms>()
const programsComposeTableFetch = useFetch(programsComposeTableFetchURL, {}).get().json<APIProgramsComposeTable>()

const programsFetchTimeout = useTimeoutFn(() => {
  log('refetch programsFetch')
  programsFetch.execute().then(() => programsFetchTimeout.start())
}, programsRefetchTimeout)

const programsComposeTableFetchTimeout = useTimeoutFn(() => {
  log('refetch programsComposeTableFetch')
  programsComposeTableFetch.execute().then(() => programsComposeTableFetchTimeout.start())
}, programsRefetchTimeout)

const settingsStore = useSettingsStore()
const filtersStore = useFiltersStore()

const { searchValueDebouncedTrimmed } = storeToRefs(filtersStore)

const genres = computed(
  () => Array.isArray(channelsFetch.data.value?.channels)
    ? channelsFetch.data.value.genres.reduce((accumulator, genre) => ({ ...accumulator, [genre.id]: genre.title }), {})
    : { },
)

function handleGenreSelect(genreId: GenreID) {
  filtersStore.selectedGenreSetOrToggle(genreId)
}

const channels = computed(
  () => channelsFetch.data.value?.channels || [],
)

const channelsAvailable = computed(() => (
  channels.value
    .filter(channel => availableChannelsNumbers.includes(channel.keyNumber))
))

const channelsSorted = computed(() => (
  channelsAvailable.value.slice().sort((a, b) => (a.keyNumber - b.keyNumber))
))

const channelsFilteredByGenre = computed(() => (
  channelsSorted.value
    .filter((channel) => {
      if (filtersStore.selectedGenre) {
        return (
          channel.relevantGenres.map(genre => genre.genreId).flat(1).includes(filtersStore.selectedGenre)
        ) // don't ask me idk how this works
      }
      return true
    })
))

const find = useFuse(searchValueDebouncedTrimmed, channelsFilteredByGenre, {
  fuseOptions: {
    keys: ['title', {
      name: 'keyNumber',
      getFn(e) {
        return (e.keyNumber.toString())
      },
    }],
  },
})

const channelsFiltered = computed(() => {
  let filtered = channelsFilteredByGenre.value

  if (filtered && searchValueDebouncedTrimmed.value.length > 0) {
    filtered = find.results.value.map(e => e.item)
  }

  return filtered
})

const genresList = computed(() => (Object.entries(genres.value).sort((_a, _b) => settingsStore.favoriteGenres.includes(_a[0]) ? -1 : 1)))

const channelsPrograms = computed(() => {
  let isFinded = true

  if (!channels.value)
    return null

  const result = channels.value
    .map((channel) => {
      const findResult = programsFetch.data.value?.schedules
        .find(schedule => (
          schedule.scheduleId === (programsComposeTableFetch.data.value?.medias.find(media => media.channelId === channel.id)?.scheduleId)
        ))
      if (isFinded && !!findResult) {
        isFinded = true
        return {
          channelId: channel.id,
          scheduleId: findResult.scheduleId,
          programs: findResult.events,
        }
      }
      return null
    })
    .filter(e => e !== null)

  return result
})

function resetFilters() {
  filtersStore.$reset()
}

const isProgramsFetching = computed(() => (programsFetch.isFetching.value || programsComposeTableFetch.isFetching.value))

// oh shit

const showOverlay = ref(false)
const numbers = ref<number[]>([])

const overlayError = ref<string | null>(null)

function cancelTvKeyboard() {
  showOverlay.value = false
  numbers.value = []
  overlayError.value = null
}

const tvKeyboardHideTimer = useTimeoutFn(() => {
  cancelTvKeyboard()
}, 3000, { immediate: false })

const keyNumber = computed(() => Number.parseInt(numbers.value.join('')))
const structuredKeyNumber = computed(() => {
  return {
    unused: Array.from({ length: maxTvKeyboardKeyNumberLength - (keyNumber.value.toString().length) }, (_, i) => i),
    used: keyNumber.value.toString().split(''),
  }
})

const ignoreTags = ['SELECT', 'INPUT', 'TEXTAREA']

function playChannel() {
  const channel = channelsAvailable.value.find(channel => channel.keyNumber === keyNumber.value)

  if (channel) {
    const link = makeChannelPlayLink(channel.id)

    window.open(link, '_blank')
  }
  else {
    overlayError.value = 'Такого канала нет или он недоступен :('
  }

  if (overlayError.value) {
    tvKeyboardHideTimer.start()
  }
  else {
    cancelTvKeyboard()
  }
}

const debouncedPlayNumber = useDebounceFn(() => {
  playChannel()
}, 5000)

const allowedTvKeyboardKeys = Array.from({ length: 10 }, (_, i) => i.toString())

onKeyStroke([...allowedTvKeyboardKeys, 'Escape', 'Enter'], (event: KeyboardEvent) => {
  if (allowedTvKeyboardKeys.includes(event.key) && document.activeElement?.tagName && !ignoreTags.includes(document.activeElement.tagName)) {
    event.preventDefault()

    showOverlay.value = true

    if (numbers.value.length >= maxTvKeyboardKeyNumberLength) {
      numbers.value.shift()
    }
    numbers.value.push(Number(event.key))

    debouncedPlayNumber()
  }
  if (event.key === 'Escape') {
    event.preventDefault()

    cancelTvKeyboard()
  }
  if (event.key === 'Enter') {
    event.preventDefault()

    playChannel()
  }
})
</script>

<template>
  <div>
    <div v-if="showOverlay" class="tvKeyboardOverlay">
      <div class="flex flex-col gap-2 max-w-md items-center">
        <p class="text-8xl font-mono">
          <span v-for="(unusedNumber, i) in structuredKeyNumber.unused" :key="unusedNumber.toString() + unusedNumber + i">-</span>
          <span v-for="(usedNumber, i) in structuredKeyNumber.used" :key="usedNumber.toString() + usedNumber + i">{{ usedNumber }}</span>
        </p>
        <p v-if="overlayError" class="text-red">
          {{ overlayError }}
        </p>
        <p class="text-2xl">
          Отмена - ESC
        </p>
        <p>
          <RouterLink to="/help" class="link">
            Если не работает, разрешите сайту открывать всплывающие окна и вкладки
          </RouterLink>
        </p>
      </div>
    </div>
    <p class="text-sm my-4 mt-1">
      Вы можете начать вводить номер канала прямо на странице, у вас будет на это 5 секунд.
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <RouterLink to="/help" class="link">Если не работает, разрешите сайту открывать всплывающие окна и вкладки</RouterLink>.
    </p>
    <input v-model="filtersStore.searchValue" type="text" class="input" placeholder="Введите запрос...">
    <div class="text-lg mt-4 flex flex-wrap gap-x-2 gap-y-2">
      <template v-if="genresList.length > 0">
        <div
          v-for="[genreId, genreName] in genresList" :key="genreId" class="flex" :class="{
            active: filtersStore.selectedGenre === (genreId),
            favorite: settingsStore.favoriteGenres.includes(genreId),
          }"
        >
          <button class="colorsTransition genreButton genreButtonGenre" @click="() => handleGenreSelect(genreId)">
            {{ genreName }}
          </button>

          <button class="genreButton colorsTransition genreButtonFavorite" @click="() => settingsStore.favoriteGenreToggle(genreId)">
            <span
              class="colorsTransition genreButtonFavoriteIcon i-tabler:heart h-1em w-1em block" :class="{ 'i-tabler:heart-filled': settingsStore.favoriteGenres.includes(genreId),
              }"
            />
          </button>
        </div>
      </template>
      <p v-else class="text-brand-500">
        Загрузка жанров, пожалуйста, подождите...
      </p>
    </div>
    <div class="flex flex-wrap gap-4 items-center">
      <p class="my-2">
        Итого: {{ channelsFiltered?.length }} канал(а/ов)
      </p><button class="colorsTransition btn btn-with-icon my-2" @click="() => resetFilters()">
        <span
          class="colorsTransition i-tabler:cancel h-1em w-1em block"
        />Очистить фильтры
      </button>
    </div>
    <ul class="mt-4 flex flex-col gap-2" :class="{ isCompactMode: settingsStore.channelsListMode === 'compact', isLogosMode: settingsStore.channelsListMode === 'logos' }">
      <template v-if="channelsFiltered.length > 0">
        <ChannelsItem v-for="channel in channelsFiltered" :key="channel.id" :channel="channel" :channels-programs="channelsPrograms" :is-programs-fetching="isProgramsFetching" :programs-compose-table-fetch="programsComposeTableFetch.data.value" />
      </template>
      <p v-else-if="(filtersStore.selectedGenre || searchValueDebouncedTrimmed !== '') && !channelsFiltered?.length" class="text-lg text-center">
        Ничего не найдено 😢
      </p>
      <p v-else class="text-brand-500">
        Загрузка, пожалуйста, подождите...
      </p>
    </ul>
  </div>
</template>

<style scoped>
.genreButton {
  @apply cursor-pointer px-3 py-0.5 border border-2 border-transparent rounded-full dark:bg-brand-500/10 bg-brand-500/13 hover:(dark:bg-brand-500/18 bg-brand-500/21);
}

.active .genreButton {
  @apply border-brand-500 dark:bg-brand-500/30 bg-brand-500/33;
}

.genreButtonGenre {
  @apply rounded-rt-0 rounded-rb-0;
}

.genreButtonFavorite {
  @apply rounded-lt-0 rounded-lb-0 px-2 pl-1.5;
}

.favorite .genreButtonFavorite .genreButtonFavoriteIcon {
  @apply text-brand-500;
}

.genreButtonFavorite:not(.active .genreButtonFavorite, .favorite .genreButtonFavorite) {
  @apply border-transparent;
}

.active.favorite .genreButtonFavorite {
  @apply border-brand-500;
}

.active .genreButtonFavorite {
  @apply border-l-transparent!;
}

/* oh shit */
.isCompactMode,
.isLogosMode {
  display: grid;
}

.isCompactMode {
  @apply gap-0;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

.isLogosMode {
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}

.tvKeyboardOverlay {
  @apply fixed top-0 right-0 bottom-0 left-0 bg-neutral-900/80 flex items-center justify-center z-10;
}
</style>
