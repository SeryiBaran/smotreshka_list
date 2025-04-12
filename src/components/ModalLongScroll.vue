<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  heading?: string
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
      <div class="mx-auto my-12 p-4 border rounded-lg bg-white flex flex-col max-w-2xl space-y-2 dark:border-brand-700 dark:bg-neutral-900 2xl:max-w-5xl">
        <div class="header2 justify-between">
          <p class="">
            {{ heading }}
          </p>
          <button class="colorsTransition icon-btn" @click="() => emit('update:modelValue', false)">
            <div class="i-carbon:close inline-block" />
          </button>
        </div>
        <div>
          <slot />
        </div>
        <button class="colorsTransition btn ml-auto mt-1" @click="() => emit('update:modelValue', false)">
          Закрыть
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
