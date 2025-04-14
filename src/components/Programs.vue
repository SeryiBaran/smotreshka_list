<script lang="ts" setup>
import type { ChannelPrograms } from '~/types'
import { useCurrentProgram, useCurrentProgramPercent, useReactiveProgramsCurrTime } from '~/composables/programs'
import { getTimeTo, isCurrentProgram, useDayJS } from '~/shared'

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
  isRealtime: false,
  dontLimitWidth: false,
  showDescription: false,
})

const reactiveProgramsCurrTime = useReactiveProgramsCurrTime(props.isRealtime)

const filteredPrograms = computed<ChannelPrograms>(() => {
  const currentProgramIndex = props.channelPrograms.programs.findIndex(program => isCurrentProgram(program.scheduledFor, reactiveProgramsCurrTime.currentTime.value))

  return { ...props.channelPrograms, programs: props.showAll ? props.channelPrograms.programs : props.channelPrograms.programs.slice(currentProgramIndex, currentProgramIndex + 2) }
})

const filteredProgramsPrograms = computed(() => filteredPrograms.value.programs)

const currentProgram = useCurrentProgram(filteredProgramsPrograms, props.isRealtime)

const currentProgramPercent = useCurrentProgramPercent(currentProgram, props.isRealtime)
</script>

<template>
  <ul v-if="props.channelPrograms.programs.length && props.channelPrograms.programs.length > 0 && filteredPrograms.programs.length > 0" class="list" :class="{ listShowDescription: props.showDescription }">
    <template v-for="program in filteredPrograms.programs">
      <template v-if="program">
        <li :key="program.id + props.channelPrograms.channelId" class="program" :class="{ programLimitWidth: !props.dontLimitWidth }">
          <p class="programInfo">
            <span v-if="props.showDate" class="font-semibold whitespace-nowrap"> {{ useDayJS()(program.scheduledFor.begin).format('YYYY.MM.DD') }} {{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }} - </span>
            <span v-else class="font-semibold whitespace-nowrap"> <span>{{ useDayJS()(program.scheduledFor.begin).format('HH:mm') }}</span> / <span>{{ useDayJS()(program.scheduledFor.end).format('HH:mm') }}</span> - </span>
            <span class="programTitle">{{ program.title }}</span>
            <span class="grow" />
            <span class="mb-0.5 pl-2 whitespace-nowrap md:self-center"> <span class="md:hidden">|||||</span> <span>{{ `${getTimeTo(program.scheduledFor, true, reactiveProgramsCurrTime.currentTime.value)}` }}</span></span>
          </p>

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
  @apply w-full 2xl:text-xl flex flex-col max-md:(gap-4);
}

.listShowDescription {
  @apply gap-4;
}

.program {
  @apply relative flex flex-col;
}

.programInfo {
  @apply flex gap-2 gap-y-0 max-md:flex-wrap;
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
  @apply bg-brand-900/20 bottom-0 left-0 right-0 absolute dark:bg-brand-100;
}

.progress {
  @apply border-0 border-b-2 border-b-brand-500 border-solid;
}
</style>
