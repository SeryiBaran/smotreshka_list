<script lang="ts" setup>
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from 'vue'
import { useField } from 'vee-validate'

interface Props {
  name: string
  type?: InputTypeHTMLAttribute
  size?: 'small' | 'regular' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'regular',
})

const { errorMessage, value, handleChange } = useField(() => props.name)
</script>

<template>
  <div class="inline-block">
    <InputText
      v-bind="($attrs as Partial<InputHTMLAttributes>)"
      :class="[{ inputWithError: !!errorMessage }]" :value="value" :type="props.type" @input="handleChange"
    />
    <span class="text-red">{{ errorMessage }}</span>
  </div>
</template>

<style scoped>
.input.inputWithError {
  @apply border-red outline-red bg-red/10 hover:not-focus:bg-red/14;
}
</style>
