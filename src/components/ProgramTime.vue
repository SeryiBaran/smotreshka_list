<script lang="ts" setup>
import type { TimeInterval } from '~/types'
import { useIsRealtime } from '~/composables/programs'
import { defaultIsRealtimePrograms, getTimeTo, useDayJS } from '~/shared'

interface Props {
  scheduledFor: TimeInterval
  showDate?: boolean
  isRealtime?: Ref<boolean> | boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDate: false,
  isRealtime: defaultIsRealtimePrograms,
})

const isRealtime = useIsRealtime(props.isRealtime)

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)
</script>

<template>
  <VTooltip>
    <span class="font-semibold whitespace-nowrap"> <span v-if="props.showDate" class="font-semibold whitespace-nowrap">{{ useDayJS()(props.scheduledFor.begin).format('YYYY.MM.DD') }}</span> {{ useDayJS()(props.scheduledFor.begin).format('HH:mm') }} <span v-if="!props.showDate">/ {{ useDayJS()(props.scheduledFor.end).format('HH:mm') }}</span> - </span>

    <template #popper>
      <p>{{ getTimeTo(props.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value) }}</p>
      <table class="popperTimetable">
        <tbody>
          <tr>
            <td>Начало:</td>
            <td>{{ useDayJS()(props.scheduledFor.begin).format('YYYY.MM.DD HH:mm') }}</td>
          </tr>
          <tr>
            <td>Конец:</td>
            <td>{{ useDayJS()(props.scheduledFor.end).format('YYYY.MM.DD HH:mm') }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </VTooltip>
</template>

<style scoped>
.popperTimetable td {
  @apply px-1;
}
</style>
