<script setup lang="ts">
import type { APIChannels, APIPrograms, APIProgramsComposeTable, ChannelID, GenreID } from '~/types'
import { useFetch } from '@vueuse/core'
import Fuse from 'fuse.js'

defineOptions({
  name: 'IndexPage',
})

const minMd = useMediaQuery('(min-width: 832px)') // to hide images, and to disable loading of big icons on small devices

const channelsPacks = {
  basic: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 25, 28, 29, 30, 35, 41, 42, 43, 48, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 61, 62, 64, 66, 67, 85, 101, 104, 123, 128, 135, 142, 151, 152, 186, 187, 189, 206, 207, 215, 217, 219, 220, 222, 224, 228, 229, 245, 309, 329, 330, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 523, 524, 526, 527, 528, 530, 531, 532, 533, 534, 535, 536, 537, 540, 541, 542, 543, 544, 547, 548, 549, 550, 552, 614, 627, 647, 649, 653, 657, 661, 662, 663, 664, 665, 667, 670, 672, 673, 674, 710, 716, 717, 718, 720, 730, 731, 734, 737, 738, 739, 745, 746, 747, 753, 754, 755, 756, 758, 761, 806, 807, 808, 811, 813, 814, 815, 821, 822, 823, 824, 825, 826, 828, 834, 835, 836, 837, 908, 909, 910, 911, 912, 913, 914, 916, 917, 920, 922, 924, 926, 927, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 948, 949],
  child: [8, 23, 48, 187, 306, 307, 308, 309, 310, 311, 312, 313, 314, 316, 317, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332],
}

const availableChannelsNumbers = [...channelsPacks.basic, ...channelsPacks.child]
const showPrograms = true

const channelsFetchURL = 'https://fe.smotreshka.tv/tv/v2/channels?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjMsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbIjVlNzlmODI5Y2YxZDlkNWE5MTg4MmYxNyIsIjVmZDM5MDJlZTUwMDA3MGJhZTM5OGI4ZSIsIjYyMzllYjVlMjQ3Mzc4MjM2NmZkMWM2MCJdLCJyZWdpb24iOiJydS5jZW50cmFsLm1vc2NvdyIsImRldmljZV90eXBlIjoicGMiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MiwibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.TOWQtBXKEV1fqKyu_z1wHszfxRM71paqfAwKC38kLnY'

const programsFetchURL = 'https://fe.smotreshka.tv/epg/v2/on-air?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJwaG9uZSIsIm5ldHdvcmtfYWZmaWxpYXRpb25fc3RhdHVzIjozLCJsb2NhbGUiOiJydSIsInByb2ZpbGVfdHlwZSI6MiwicHJvZmlsZV9yZXN0cmljdGlvbl92YWx1ZSI6M30.wB3RTIMXoURTU-j_afc3AIH575HhQMclIE8EMuJ1NSM'

const programsComposeTableFetchURL = 'https://fe.smotreshka.tv/tv/v2/medias?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJ0YWJsZXQiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MywibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.jl_3Bn2iw7GRb7CCsj75XqbjJykPmRa655LBKQly8ds'

function formatKeyNumber(keyNumber: number) {
  return keyNumber.toString().padStart(3, '0')
}

const channelsFetch = useFetch(channelsFetchURL, {}).get().json<APIChannels>()
const programsFetch = useFetch(programsFetchURL, {}).get().json<APIPrograms>()
const programsComposeTableFetch = useFetch(programsComposeTableFetchURL, {}).get().json<APIProgramsComposeTable>()

const searchValue = ref('')
const searchValueDebounced = refDebounced(searchValue, 500)

const favoriteGenres = ref(['federal'])

const genres = computed(
  () => Array.isArray(channelsFetch.data.value?.channels)
    ? channelsFetch.data.value.genres.reduce((accumulator, genre) => ({ ...accumulator, [genre.id]: genre.title }), {})
    : { },
)

const activeGenres = ref<GenreID[]>([])

function handleGenreSelect(genreId: GenreID) {
  const findIndex = activeGenres.value.findIndex(elem => elem === genreId)
  if (findIndex >= 0) {
    activeGenres.value = activeGenres.value.filter(elem => elem !== genreId)
  }
  else {
    activeGenres.value = [...activeGenres.value, genreId]
  }
}

// watch(activeGenres, (newState) => { console.log(newState) })

const channels = computed(
  () => channelsFetch.data.value?.channels,
)

const channelsAvailable = computed(() => (
  channels.value
    ?.filter(channel => availableChannelsNumbers.includes(channel.keyNumber))
))

const channelsSorted = computed(() => (
  channelsAvailable.value?.slice().sort((a, b) => (a.keyNumber - b.keyNumber))
))

const channelsFilteredByGenre = computed(() => (
  channelsSorted.value
    ?.filter((channel) => {
      if (activeGenres.value.length > 0) {
        return (
          channel.relevantGenres.map(genre => genre.genreId).flat(1).some(r => activeGenres.value.includes(r))
          && activeGenres.value.every(r => channel.relevantGenres.map(genre => genre.genreId).flat(1).includes(r))
        ) // don't ask me idk how this works
      }
      return true
    })
))

const channelsFiltered = computed(() => {
  let filtered = channelsFilteredByGenre.value

  const search = searchValueDebounced.value.trim()
  if (filtered && search.length > 0) {
    const fuse = new Fuse(filtered, {
      keys: ['title', {
        name: 'keyNumber',
        getFn(e) {
          return formatKeyNumber(e.keyNumber)
        },
      }],
    })

    filtered = fuse.search(search).map(e => e.item)
  }

  return filtered
})

const genresList = computed(() => (Object.entries(genres.value).sort((_a, _b) => favoriteGenres.value.includes(_a[0]) ? -1 : 1)))

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

  return result
})

function findChannelPrograms(channelId: ChannelID) {
  return channelsPrograms.value!.find(channelPrograms => channelPrograms?.channelId === channelId)! // I AM FUCKED MY MIND ABOUT 2 HOURS WITHOUT THESE `!`.
}
</script>

<template>
  <div>
    <input v-model="searchValue" type="text" class="search px-4 py-3 outline-0 outline-brand-500 outline-solid border-1 border-transparent rounded-2 border-solid bg-brand-500/10 w-full block focus:outline-2 not-focus:border-brand-400 hover:not-focus:bg-brand-500/14" placeholder="Введите запрос...">
    <div class="mt-4 flex flex-wrap gap-x-2 gap-y-3">
      <button v-for="[genreId, genreName] in genresList" :key="genreId" class="genreButton" :class="{ active: activeGenres.includes(genreId), favoriteGenre: favoriteGenres.includes(genreId) }" @click="() => handleGenreSelect(genreId)">
        {{ genreName }}
      </button>
    </div>
    <p class="my-2">
      Итого: {{ channelsFiltered?.length }} канал(а/ов)
    </p>
    <ul class="mt-4 flex flex-col gap-4">
      <li v-for="channel in channelsFiltered" :key="channel.id" class="border border-2 border-transparent rounded-4 hover:border-brand-500 hover:bg-brand-500/15 hover:dark:bg-brand-500/12">
        <a :href="`https://smotreshka.tv/channels/now/${channel.id}/watch`" class="p-4 flex gap-4">
          <img v-if="minMd" class="channelLogo border border-1 border-brand-500 rounded-4 w-50 aspect-video" :src="channel.logoUrl" :alt="`Иконка ${formatKeyNumber(channel.keyNumber)} ${channel.title}`">
          <div>
            <div class="channelTitle flex gap-5 items-center">
              <span class="channelNumber text-3xl text-brand-800 font-semibold dark:text-brand-300">{{ formatKeyNumber(channel.keyNumber) }}</span>
              <span class="channelName text-2xl">{{ channel.title }}</span>
            </div>
            <Programs v-if="showPrograms && channelsPrograms && findChannelPrograms(channel.id) !== undefined" :channel-programs="findChannelPrograms(channel.id)" />
            <p v-else class="text-sm mt-2">
              {{ `${channel.description.slice(0, 200)}...` }}
            </p>
          </div>
        </a>
      </li>
      <p v-if="(activeGenres.length > 0) && !channelsFiltered?.length" class="text-lg text-center">
        Ничего не найдено 😢
      </p>
    </ul>
  </div>
</template>

<style scoped>
.genreButton {
  @apply cursor-pointer px-3 py-0.5 border border-2 border-transparent rounded-full dark:bg-brand-500/10 bg-brand-500/13 hover:(dark:bg-brand-500/18 bg-brand-500/21);
}

.genreButton.active {
  @apply border-brand-500 dark:bg-brand-500/30 bg-brand-500/33;
}

.genreButton.favoriteGenre {
  box-shadow: 0 0 calc(var(--spacing) * 2) calc(var(--spacing) * 0.8)
    color-mix(in oklch, oklch(0.623 0.214 259.815) 50%, transparent);
}
</style>
