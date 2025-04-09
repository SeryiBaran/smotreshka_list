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
    <div v-for="channelsPack in channelsPacksMapped" :key="channelsPack.id">
      <p>{{ channelsPack.name }}</p>
      <textarea :value="channelsPack.numbers.join(', ')" readonly class="input" />
    </div>
  </div>
</template>

<style scoped>

</style>
