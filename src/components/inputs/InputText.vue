<script lang="ts" setup>
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from 'vue'

interface Props {
  type?: InputTypeHTMLAttribute
  size?: 'small' | 'regular' | 'large'
  modelValue?: unknown
  isTextarea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'regular',
  isTextarea: false,
})

const emit = defineEmits<{
  'update:modelValue': [Props['modelValue']]
}>()
</script>

<template>
  <component
    :is="isTextarea ? 'textarea' : 'input'"
    v-bind="($attrs as Partial<InputHTMLAttributes>)"
    :value="props.modelValue" class="input max-w-sm w-full" :class="[`input_${props.size}`, { isTextarea }]" :type="props.type" @input="(event: InputEvent) => emit('update:modelValue', (event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.input {
  @apply colorsTransition search px-4 py-3 outline-0 outline-brand-500 outline-solid border-1 border-transparent rounded-2 border-solid bg-brand-500/10 block focus:outline-2 not-focus:border-brand-400;
}

.input.input_small {
  @apply px-2 py-1;
}

.input.input_regular {
  @apply px-3 py-2;
}

.input.input_large {
  @apply px-4 py-3;
}

.input[readonly] {
  @apply border-brand-900 outline-0;
}

.input:not([readonly]) {
  @apply hover:not-focus:bg-brand-500/14;
}

.input.inputWithError {
  @apply border-red outline-red bg-red/10 hover:not-focus:bg-red/14;
}
</style>
