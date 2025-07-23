<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  heading?: string
  channelEpgLink?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()
</script>

<template>
  <VueFinalModal
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    content-class="absolute inset-0"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <div
      class="h-full inset-0 absolute overflow-auto"
      @click.self="() => emit('update:modelValue', false)"
    >
      <div class="modalContent mx-auto my-12 border rounded-lg bg-white max-w-2xl dark:border-brand-700 dark:bg-neutral-900 2xl:max-w-5xl">
        <div class="modalInsetContainer p-4 flex flex-col space-y-2">
          <div class="header2 my-b-border justify-between">
            <p class="headerContainer">
              <span>{{ heading }}</span>
              <a v-if="channelEpgLink" :href="channelEpgLink" class="colorsTransition btn-icon externalEpgLink text-4 2xl:text-6" title="Открыть нормальную полную официальную программу">
                <span class="colorsTransition i-tabler:external-link block" />
              </a>
            </p>
            <button class="colorsTransition closeEpgBtnHeader icon-btn" @click="() => emit('update:modelValue', false)">
              <div class="i-carbon:close inline-block" />
            </button>
          </div>
          <div>
            <a :href="channelEpgLink" class="link text-xl">Открыть нормальную полную официальную программу</a>
            <slot />
          </div>
          <button class="colorsTransition closeEpgBtnFooter btn ml-auto mt-1" @click="() => emit('update:modelValue', false)">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
.headerContainer {
  @apply flex gap-1 items-center;
}

.btn-icon.externalEpgLink {
  @apply inline-flex text-xl;
}
</style>
