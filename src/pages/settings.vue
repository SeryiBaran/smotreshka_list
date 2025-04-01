<script lang="ts" setup>
import { unoPresetColors } from '~/shared'
import { useSettingsStore } from '~/store/settings'

const colorsList = Object.keys(unoPresetColors)

const settingsStore = useSettingsStore()
</script>

<template>
  <div>
    <ul>
      <li>
        <span>Выберите цвет:</span>
        <select v-model="settingsStore.brandColor" name="brandColor" placeholder="Выберите" class="ml-2 max-w-42 w-full inline-block">
          <option v-for="color in colorsList" :key="color" :style="`color: var(--colors-${color}-500);`" :value="color">
            {{ color }}
          </option>
        </select>
        <button class="btn ml-2" @click="settingsStore.brandColorReset()">
          Сброс
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
