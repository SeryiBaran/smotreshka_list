<script lang="ts" setup>
interface Props {
  checkboxLabel: string
}

const props = defineProps<Props>()

const model = defineModel()
</script>

<template>
  <label class="checkbox_label">
    <input
      v-model="model"
      class="checkbox_input"
      type="checkbox"
    >
    <span class="checkbox_box"><span class="checkbox_box_icon i-tabler-check text-4 inline-block" /></span>
    {{ props.checkboxLabel }}
  </label>
</template>

<style scoped>
.checkbox_label {
  display: inline-flex;
  align-items: center;
  margin-top: 0.2em;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox_input {
  position: absolute;
  appearance: none;
  /* top: -9999px;
  left: -9999px; */
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
}

.checkbox_box {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border-radius: 2px;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  transition-property: background-color, outline-width, outline-color;
  transition-duration: 100ms;
  transition-timing-function: ease;

  border: none;
  border-radius: 5px;

  @apply bg-brand-500/15 outline-brand-500/50 outline-solid outline-0 flex items-center justify-center;
  border: transparent solid 1px;
}

.checkbox_input:not(:checked) + .checkbox_box {
  @apply border-brand-400;
}

.checkbox_input + .checkbox_box .checkbox_box_icon {
  @apply opacity-0 text-white dark:text-black;
}

.checkbox_input:checked + .checkbox_box {
  @apply bg-brand-500/100;
}

.checkbox_input:checked + .checkbox_box .checkbox_box_icon {
  @apply opacity-100;
}

.checkbox_label:focus .checkbox_box,
.checkbox_input:focus + .checkbox_box,
.checkbox_box:focus {
  outline-width: 4px;
}

.checkbox_input:checked:disabled + .checkbox_box {
  background-color: #9b9b9b;
}
</style>
