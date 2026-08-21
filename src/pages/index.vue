<script setup lang="ts">
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Channel } from '~/types'
import { useFuse } from '@vueuse/integrations/useFuse'
import { storeToRefs } from 'pinia'
import { useChannels } from '~/api/channels'
import { usePrograms } from '~/api/programs'
import Checkbox from '~/components/inputs/Checkbox.vue'
import TheTvKeyboardProvider from '~/components/TheTvKeyboardProvider.vue'
import { channelsPacksLastEdit, isCurrentProgram, useDayJS } from '~/shared'
import { useFiltersStore } from '~/store/filters'
import { useSettingsStore } from '~/store/settings'
import { SPECIAL_GENRES } from '~/types'

// TODO: try to fix lag when navigating to that page // fixed, but butt

defineOptions({
  name: 'IndexPage',
})

const settingsStore = useSettingsStore()
const filtersStore = useFiltersStore()

const channels = useChannels()
const programs = usePrograms()

const { searchValueDebouncedTrimmed } = storeToRefs(filtersStore)

const channelsFilteredByGenre = computed(() => (
  channels.channelsSorted.value
    .filter((channel) => {
      if (filtersStore.selectedGenre) {
        if (filtersStore.selectedGenre === SPECIAL_GENRES.LOCAL_FAVORITE) {
          return (
            settingsStore.favoriteChannels.includes(channel.id)
          ) // don't ask me idk how this works
        }
        return (
          channel.relevantGenres.map(genre => genre.genreId).flat(1).includes(filtersStore.selectedGenre)
        ) // don't ask me idk how this works
      }
      return true
    })
))

const searchByProgram = ref(false)

const fuseOptions = computed<UseFuseOptions<Channel>>(() => ({
  fuseOptions: {
    keys: ['title', searchByProgram.value
      ? {
          name: 'currentProgram',
          getFn(e) {
            const a = programs.channelsPrograms.value.find(program => program.channelId === e.id)?.programs.find(program => isCurrentProgram(program.scheduledFor))?.title || ''
            return a
          },
        }
      : {
          name: 'keyNumber',
          getFn(e) {
            return (e.keyNumber.toString())
          },
        }],
  },
}))

const find = useFuse(searchValueDebouncedTrimmed, channelsFilteredByGenre, fuseOptions)

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
    <p class="text-sm mt-1">
      Если список в коде обновить возможности нет, прошу обратить внимание на последнюю галочку на странице <RouterLink to="/settings" class="link">
        Настройки
      </RouterLink>
    </p>
    <p class="text-sm mt-1">
      Последнее обновление списка произошло <span :title="useDayJS()(channelsPacksLastEdit).format()">{{ useDayJS()(channelsPacksLastEdit).fromNow() }}</span>
    </p>
    <p class="text-sm my-4 mt-1">
      Вы можете начать вводить номер канала прямо на странице, у вас будет на это {{ settingsStore.tvKeyboardDebounce }} секунд.
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <RouterLink to="/help" class="link">Если не работает, разрешите сайту открывать всплывающие окна и вкладки</RouterLink>.
    </p>
    <Checkbox v-model="searchByProgram" checkbox-label="Искать по передаче" class="mb-2" />
    <InputText v-model="filtersStore.searchValue" class="searchBar" placeholder="Введите запрос..." />
    <div class="text-lg mt-4 flex flex-wrap gap-x-2 gap-y-2">
      <template v-if="channels.genresList.value && channels.genresList.value.length > 0">
        <GenreElement
          genre-name="Все каналы"
          :show-favorite-button="false"
          :is-active="filtersStore.selectedGenre === null"
          :is-favorite="false"
          @toggle-active="filtersStore.selectedGenreReset()"
        />
        <GenreElement
          genre-name="Локал избранное"
          :show-favorite-button="false"
          :is-active="filtersStore.selectedGenre === SPECIAL_GENRES.LOCAL_FAVORITE"
          :is-favorite="false"
          @toggle-active="filtersStore.selectedGenreSetOrToggle(SPECIAL_GENRES.LOCAL_FAVORITE)"
        />
        <GenreElement
          v-for="[genreId, genreTitle] in channels.genresList.value"
          :key="genreId"
          :genre-name="genreTitle"
          :is-active="filtersStore.selectedGenre === (genreId)"
          :is-favorite="settingsStore.favoriteGenres.includes(genreId)"
          @toggle-active="filtersStore.selectedGenreSetOrToggle(genreId)"
          @toggle-favorite="settingsStore.favoriteGenreToggle(genreId)"
        />
      </template>
      <p v-else class="text-brand-500">
        Загрузка жанров, пожалуйста, подождите...
      </p>
    </div>
    <div class="flex flex-wrap gap-4 items-center">
      <p class="my-2">
        Итого каналов: {{ channelsFiltered.length }}
      </p><button id="filtersClearBtn" class="colorsTransition btn btn-with-icon my-2" @click="resetFilters()">
        <span
          class="colorsTransition i-tabler:cancel text-inherit block"
        />Очистить фильтры
      </button>
    </div>
    <ul
      id="channelsList"
      class="mt-4 flex flex-col gap-2"
      :class="{ isCompactMode: settingsStore.channelsListMode === 'compact', isLogosMode: settingsStore.channelsListMode === 'logos' }"
    >
      <template v-if="channelsFiltered.length > 0">
        <ChannelsItem
          v-for="channel in channelsFiltered"
          :key="channel.id"
          :channel="channel"
          :is-programs-fetching="programs.isFetching.value"
          :programs-compose-table="programs.programsComposeTable.value"
        />
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
.searchBar {
  @apply max-w-full;
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
