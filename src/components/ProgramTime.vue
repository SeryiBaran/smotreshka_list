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
  <span class="font-600 whitespace-nowrap"> <template v-if="props.showDate">{{ useDayJS()(props.scheduledFor.begin).format('YYYY.MM.DD') }}</template> {{ useDayJS()(props.scheduledFor.begin).format('HH:mm') }} <template v-if="!props.showDate">/ {{ useDayJS()(props.scheduledFor.end).format('HH:mm') }}</template> - </span>
</template>
