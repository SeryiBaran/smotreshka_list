<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

import {
  channelsListModesNames,
  denyBrandColors,
  settingsDefaults,
  unoPresetColors,
} from '~/shared'
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

const schemaNumberInputsNames = ['channelsImagesSize', 'tvKeyboardDebounce', 'tvKeyboardHideTime'] as const

// TODO: pass all inputs (checkboxes and selects) through vee-validate too
const schema = toTypedSchema(
  z.object({
    ...schemaNumberInputsNames.reduce((acc, current) => {
      return { ...acc, [current]: z.number({ message: 'Введите число!' })
        .min(settingsDefaults[current].min, `Число должно быть больше ${settingsDefaults[current].min - 1}!`)
        .max(settingsDefaults[current].max, `Число должно быть меньше ${settingsDefaults[current].max + 1}!`) }
    }, {}),
  }),
)

const { errors, resetForm, handleSubmit, setValues } = useForm({
  validationSchema: schema,
  initialValues: settingsStore,
})

const [showColorsTable, toogleShowColorsTable] = useToggle(false)

const doneMessage = ref<string | null>(null)

const isShowDoneMessageTimeout = useTimeoutFn(() => {
  doneMessage.value = null
}, 3000)

let resetPlanned = false

settingsStore.$subscribe((_event, newState) => {
  if (resetPlanned) {
    setValues(toRaw(newState))
    resetPlanned = false
  }
})

function handleAllReset() {
  settingsStore.$reset()
  doneMessage.value = 'Настройки сброшены!'
  isShowDoneMessageTimeout.start()
  resetPlanned = true
  resetForm()
}

const handleSave = handleSubmit((newValues) => {
  settingsStore.$patch(newValues)
  doneMessage.value = 'Настройки сохранены!'
  isShowDoneMessageTimeout.start()
})
</script>

<template>
  <div>
    <ul>
      <li>
        <span>Выберите цвет:</span>
        <select v-model="settingsStore.brandColor" name="brandColor" placeholder="Выберите" class="ml-2 max-w-42 w-full inline-block">
          <option v-for="color in colorsList" :key="color" :value="color">
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
      <li><Checkbox v-model="settingsStore.isOpenNewTab" checkbox-label="Открывать каналы в новой вкладке" /></li>
      <li>
        <Checkbox v-model="settingsStore.isShowChannelsImages" checkbox-label="Показывать картинки каналов" />
      </li>
      <li>
        <span>Размер картинок каналов (48 - 1920):</span>
        <InputTextValidated name="channelsImagesSize" type="number" class="ml-2 inline-block" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isShowPrograms" checkbox-label="Показывать программы" />
      </li>
      <li>
        <span>Выберите режим списка:</span>
        <select v-model="settingsStore.channelsListMode" name="channelsListMode" placeholder="Выберите" class="ml-2 max-w-42 w-full inline-block">
          <option v-for="mode in Object.entries(channelsListModesNames)" :key="mode[0]" :value="mode[0]">
            {{ mode[1] }}
          </option>
        </select>
      </li>
      <li>
        <Checkbox v-model="settingsStore.isShowInfoOnHover" checkbox-label="Показывать инфо о передачах при наведении" />
      </li>
      <li>
        <span>Дебаунс ТВ клавиатуры в секундах (1 - 10):</span>
        <InputTextValidated name="tvKeyboardDebounce" type="number" class="ml-2 inline-block" />
      </li>
      <li>
        <span>Задержка выключения ТВ клавиатуры в секундах (1 - 10):</span>
        <InputTextValidated name="tvKeyboardHideTime" type="number" class="ml-2 inline-block" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isRealtimePrograms" checkbox-label="Постоянно обновлять программы" />
      </li>
      <li>
        <button class="colorsTransition btn ml-2" :disabled="Object.values(errors).length > 0" @click="handleSave()">
          Сохранить настройки
        </button>
      </li>
      <li>
        <button class="colorsTransition btn ml-2" @click="handleAllReset()">
          Сбросить настройки
        </button>
      </li>
      <li>
        <RouterLink class="colorsTransition btn btn-with-icon ml-2" to="/available_channels_settings">
          <span
            class="colorsTransition i-tabler:list h-1em w-1em"
          />Просмотр доступных номеров каналов
        </RouterLink>
      </li>
    </ul>
    <span v-show="!!doneMessage" class="ml-2">{{ doneMessage }}</span>
  </div>
</template>

<style scoped>
li {
  @apply my-4 p-2 border-l-solid border-l-4 border-brand-500 w-full flex flex-wrap items-center;
}
</style>
