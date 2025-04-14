<script setup lang="ts">
import type { GenreID } from '~/types'
import { useFuse } from '@vueuse/integrations/useFuse'
import { storeToRefs } from 'pinia'
import { useChannels } from '~/api/channels'
import { usePrograms } from '~/api/programs'
import TheTvKeyboardProvider from '~/components/TheTvKeyboardProvider.vue'
import { useFiltersStore } from '~/store/filters'
import { useSettingsStore } from '~/store/settings'

defineOptions({
  name: 'IndexPage',
})

const settingsStore = useSettingsStore()
const filtersStore = useFiltersStore()

const channels = useChannels()
const programs = usePrograms()

const { searchValueDebouncedTrimmed } = storeToRefs(filtersStore)

function handleGenreSelect(genreId: GenreID) {
  filtersStore.selectedGenreSetOrToggle(genreId)
}

const channelsFilteredByGenre = computed(() => (
  channels.channelsSorted.value
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

function resetFilters() {
  filtersStore.$reset()
}
</script>

<template>
  <div class="flex grow flex-col">
    <TheTvKeyboardProvider :channels-available="channels.channelsAvailable.value" />
    <p class="text-sm my-4 mt-1">
      Вы можете начать вводить номер канала прямо на странице, у вас будет на это 5 секунд.
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <RouterLink to="/help" class="link">Если не работает, разрешите сайту открывать всплывающие окна и вкладки</RouterLink>.
    </p>
    <input v-model="filtersStore.searchValue" type="text" class="input" placeholder="Введите запрос...">
    <div class="text-lg mt-4 flex flex-wrap gap-x-2 gap-y-2">
      <template v-if="channels.genresList.value.length > 0">
        <div
          v-for="[genreId, genreName] in channels.genresList.value" :key="genreId" class="genreGroup flex" :class="{
            active: filtersStore.selectedGenre === (genreId),
            favorite: settingsStore.favoriteGenres.includes(genreId),
          }"
        >
          <button class="colorsTransition genreButton genreButtonGenre" @click="() => handleGenreSelect(genreId)">
            {{ genreName }}
          </button>
          <button class="genreButton colorsTransition genreButtonFavorite" @click="() => settingsStore.favoriteGenreToggle(genreId)">
            <span
              class="colorsTransition genreButtonFavoriteIcon i-tabler:heart" :class="{ 'i-tabler:heart-filled': settingsStore.favoriteGenres.includes(genreId),
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
        <ChannelsItem v-for="channel in channelsFiltered" :key="channel.id" :channel="channel" :channels-programs="programs.channelsPrograms" :is-programs-fetching="programs.isFetching.value" :programs-compose-table="programs.programsComposeTable.value" />
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

.genreGroup.active .genreButton {
  @apply border-brand-500 dark:bg-brand-500/30 bg-brand-500/33;
}

.genreButtonGenre {
  @apply rounded-rt-0 rounded-rb-0;
}

.genreButtonFavorite {
  @apply rounded-lt-0 rounded-lb-0 px-2 pl-1.5;
}

.genreButtonFavoriteIcon {
  @apply h-1em w-1em block;
}

.genreGroup.favorite .genreButtonFavorite .genreButtonFavoriteIcon {
  @apply text-brand-500;
}

.genreButtonFavorite:not(.active .genreButtonFavorite, .genreGroup.favorite .genreButtonFavorite) {
  @apply border-transparent;
}

.genreGroup.active.favorite .genreButtonFavorite {
  @apply border-brand-500;
}

.genreGroup.active .genreButtonFavorite {
  @apply border-l-transparent!;
}

/* oh shit */
ul.isCompactMode,
ul.isLogosMode {
  display: grid;
}

ul.isCompactMode {
  @apply gap-0;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

ul.isLogosMode {
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}
</style>
