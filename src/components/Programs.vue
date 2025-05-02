<script lang="ts" setup>
import type { ChannelPrograms } from '~/types'
import { Tooltip } from 'floating-vue'
import { useCurrentProgram, useCurrentProgramPercent, useIsRealtime, useReactiveProgramsCurrTime } from '~/composables/programs'
import { defaultIsRealtimePrograms, getTimeTo, isCurrentProgram, useDayJS } from '~/shared'
import { useSettingsStore } from '~/store/settings'

interface Props {
  channelPrograms: ChannelPrograms
  showAll?: boolean
  showDate?: boolean
  showProgress?: boolean
  isRealtime?: Ref<boolean> | boolean
  dontLimitWidth?: boolean
  showDescription?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAll: false,
  showDate: false,
  showProgress: false,
  isRealtime: defaultIsRealtimePrograms,
  dontLimitWidth: false,
  showDescription: false,
})

const settingsStore = useSettingsStore()

const isRealtime = useIsRealtime(props.isRealtime)

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(isRealtime)

const filteredPrograms = computed<ChannelPrograms>(() => {
  const programs = props.channelPrograms.programs
  const currentProgramIndex = programs.findIndex(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value))

  const result = { channelId: props.channelPrograms.channelId, scheduleId: props.channelPrograms.scheduleId, programs: props.showAll ? programs : programs.slice(currentProgramIndex, currentProgramIndex + 2) }

  return result
})

const filteredProgramsPrograms = computed(() => filteredPrograms.value.programs)

const currentProgram = useCurrentProgram(filteredProgramsPrograms, isRealtime)

const currentProgramPercent = useCurrentProgramPercent(currentProgram, isRealtime)
</script>

<template>
  <ul v-if="props.channelPrograms.programs.length && props.channelPrograms.programs.length > 0 && filteredPrograms.programs.length > 0" class="list" :class="{ listShowDescription: props.showDescription }">
    <template v-for="program in filteredPrograms.programs">
      <template v-if="program">
        <li :key="program.id + props.channelPrograms.channelId" class="program" :class="{ programLimitWidth: !props.dontLimitWidth }">
          <div class="programInfo">
            <Tooltip :disabled="!settingsStore.isShowProgramPopups">
              <ProgramTime :scheduled-for="program.scheduledFor" :show-date="props.showDate" />
              <template #popper>
                <table class="popperTimetable">
                  <tbody>
                    <tr>
                      <td>Начало:</td>
                      <td>{{ useDayJS()(program.scheduledFor.begin).format('YYYY.MM.DD HH:mm') }}</td>
                    </tr>
                    <tr>
                      <td>Конец:</td>
                      <td>{{ useDayJS()(program.scheduledFor.end).format('YYYY.MM.DD HH:mm') }}</td>
                    </tr>
                    <tr>
                      <td>{{ isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value) ? "Началось" : 'Начнётся' }}:</td>
                      <td>{{ getTimeTo(program.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value) }}</td>
                    </tr>
                    <tr>
                      <td>Продлится{{ isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value) ? " ещё" : '' }}:</td>
                      <td>{{ getTimeTo(program.scheduledFor, false, isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value) ? reactiveProgramsCurrTime.currentTime.value : useDayJS()(program.scheduledFor.begin), true) }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </Tooltip>
            <Tooltip :disabled="!settingsStore.isShowProgramPopups">
              <span class="programTitle">{{ program.title }}</span>
              <template #popper>
                <div class="max-w-50 w-full">
                  <img class="prgImg" :src="`${program.logoUrl}?width=${settingsStore.channelsImagesSize}&height=${Math.floor(settingsStore.channelsImagesSize / (16 / 9))}&quality=93`" :alt="`Иконка ${program.title}`">
                  <div class="px-3 py-2">
                    <p class="text-brand-200 leading-4">
                      {{ program.title }}
                    </p>
                    <p v-if="program.eventDescriptionMedium" class="text-sm leading-4 mt-2">
                      {{ program.eventDescriptionMedium }}
                    </p>
                  </div>
                </div>
              </template>
            </Tooltip>
            <span class="grow" />
            <span class="mb-0.5 pl-2 whitespace-nowrap md:self-center"> <span class="md:hidden">|||||</span> <span>{{ `${getTimeTo(program.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value)}` }}</span></span>
          </div>

          <p
            v-if="props.showDescription && program.eventDescriptionMedium"
            class="programDescription"
          >
            {{ program.eventDescriptionMedium }}
          </p>

          <div
            v-if="props.showProgress && currentProgram && isCurrentProgram(currentProgram.scheduledFor, reactiveProgramsCurrTime.currentTime.value)"
            class="progressContainer"
          >
            <div class="progress" :style="{ width: `${isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value) ? currentProgramPercent : 0}%` }" />
          </div>
        </li>
      </template>
    </template>
  </ul>
</template>

<style scoped>
.list {
  @apply w-full xl:text-xl 2xl:text-2xl flex flex-col max-md:(gap-4);
}

.listShowDescription {
  @apply gap-4;
}

.program {
  @apply relative flex flex-col;
}

.programInfo {
  @apply flex gap-2 gap-y-0 max-md:flex-wrap items-center;
}

.programDescription {
  @apply opacity-80 text-sm;
}

.programLimitWidth {
  @apply max-w-3xl 2xl:max-w-4xl;
}

.programTitle {
  @apply text-brand-800 dark:text-brand-300;
}

.progressContainer {
  @apply bg-brand-900/15 dark:bg-brand-900/10 bottom--1 left-0 right-0 absolute dark:bg-brand-100;
}

.progress {
  @apply border-0 border-b-2 xl:border-b-4 border-b-brand-500 border-solid;
}

.popperTimetable {
  @apply m-2;
}

.popperTimetable td {
  @apply px-1;
}
</style>
