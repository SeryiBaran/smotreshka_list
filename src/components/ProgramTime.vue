<script lang="ts" setup>
import type { TimeInterval } from '~/types'
import { defaultIsRealtimePrograms, useDayJS } from '~/shared'

interface Props {
  scheduledFor: TimeInterval
  showDate?: boolean
  isRealtime?: Ref<boolean> | boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDate: false,
  isRealtime: defaultIsRealtimePrograms,
})
</script>

<template>
  <span class="font-semibold whitespace-nowrap"> <span v-if="props.showDate" class="font-semibold whitespace-nowrap">{{ useDayJS()(props.scheduledFor.begin).format('YYYY.MM.DD') }}</span> {{ useDayJS()(props.scheduledFor.begin).format('HH:mm') }} <span v-if="!props.showDate">/ {{ useDayJS()(props.scheduledFor.end).format('HH:mm') }}</span> - </span>
</template>
