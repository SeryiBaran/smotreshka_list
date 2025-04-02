<script lang="ts" setup>
import { denyBrandColors, unoPresetColors } from '~/shared'
import { useSettingsStore } from '~/store/settings'

const colorsList = Object.keys(unoPresetColors).filter(c => !denyBrandColors.includes(c))

const colors = Object.entries(unoPresetColors).filter(c => !denyBrandColors.includes(c[0])).map(([key, value]) => {
  if (typeof value !== 'string' && typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return { name: key, value }
  }
  else {
    return null
  }
}).filter(e => e !== null)

const settingsStore = useSettingsStore()

const [showColorsTable, toogleShowColorsTable] = useToggle(false)

const isShowResetDoneMessage = ref(false)

const isShowResetDoneMessageTimeout = useTimeoutFn(() => {
  isShowResetDoneMessage.value = false
}, 3000)

function handleAllReset() {
  settingsStore.$reset()
  isShowResetDoneMessage.value = true
  isShowResetDoneMessageTimeout.start()
}
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
        <button class="colorsTransition btn ml-2" @click="settingsStore.brandColorReset()">
          Сброс
        </button>
        <button class="colorsTransition btn ml-2 block" @click="toogleShowColorsTable()">
          {{ showColorsTable ? "Закрыть" : "Открыть" }} справку
        </button>
        <div v-if="showColorsTable" class="mt-4">
          <div v-for="color in colors" :key="color.name" class="flex">
            <span class="text-xs w-16 inline-block">{{ color.name }}</span>
            <div class="flex">
              <span v-for="[oneColorKey, oneColorValue] in Object.entries(color.value).sort((a, b) => (a[0] === 'DEFAULT' ? -1 : parseInt(a[0]) - parseInt(b[0])))" :key="color.name + oneColorKey" :style="`background-color: ${oneColorValue};`" class="text-xs text-white h-8 w-8 inline-block [text-shadow:_1px_1px_1px_rgba(0,0,0,1)]">{{ oneColorKey.replaceAll('DEFAULT', 'DFLT') }}</span>
            </div>
          </div>
        </div>
      </li>
      <li><label><input id="isOpenNewTabCheck" v-model="settingsStore.isOpenNewTab" type="checkbox" name="isOpenNewTabCheck"> Открывать каналы в новой вкладке</label></li>
      <li><label><input id="isShowChannelsImagesCheck" v-model="settingsStore.isShowChannelsImages" type="checkbox" name="isShowChannelsImages"> Показывать картинки каналов</label></li>
      <li>
        <button class="colorsTransition btn ml-2 block" @click="handleAllReset()">
          СБРОСИТЬ ВСЕ НАСТРОЙКИ
        </button>
        <span v-show="isShowResetDoneMessage" class="ml-2">Настройки сброшены!</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  @apply my-4 p-2 border-l-solid border-l-4 border-brand-500;
}
</style>
