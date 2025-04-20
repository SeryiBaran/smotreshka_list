<script lang="ts" setup>
import type { Entries } from '~/types'
import { channelsPacks, channelsPacksLastEdit, channelsPacksNames, useDayJS } from '~/shared'

const channelsPacksMapped = (Object.entries(channelsPacks) as Entries<typeof channelsPacks>).map(e => ({
  id: e[0],
  name: channelsPacksNames[e[0]],
  numbers: e[1],
}))
</script>

<template>
  <div>
    <p class="text-xs my-4">
      Изменено {{ useDayJS()(channelsPacksLastEdit).format("DD.MM.YYYY") }}
    </p>
    <div v-for="channelsPack in channelsPacksMapped" :key="channelsPack.id" class="mt-4">
      <p>{{ channelsPack.name }}</p>
      <code>{{ channelsPack.numbers.join(', ') }}</code>
      <!-- <InputText :is-textarea="true" :value="channelsPack.numbers.join(', ')" readonly class="myTextarea" /> -->
    </div>
  </div>
</template>

<style scoped>
.myTextarea {
  @apply max-w-2xl;
}
</style>
