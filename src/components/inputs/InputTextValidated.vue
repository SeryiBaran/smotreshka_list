<script lang="ts" setup>
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from 'vue'
import { useField } from 'vee-validate'

interface Props {
  name: string
  type?: InputTypeHTMLAttribute
  size?: 'small' | 'regular' | 'large'
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()

const { errorMessage, value, handleChange } = useField(props.name)
</script>

<template>
  <div class="inline-block">
    <InputText
      v-bind="($attrs as Partial<InputHTMLAttributes>)"
      :class="[{ inputWithError: !!errorMessage }]" :value="value" :type="props.type" :size="props.size" @input="handleChange"
    />
    <span class="text-red">{{ errorMessage }}</span>
  </div>
</template>

<style scoped>

</style>
