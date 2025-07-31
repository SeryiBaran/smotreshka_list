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

const schemaNumberInputsNames = ['channelsImagesSize', 'tvKeyboardDebounce', 'tvKeyboardHideTime', 'backgroundColorizationOpacity'] as const

function createZNumberInput(inputName: (typeof schemaNumberInputsNames)[number]) {
  return z.number({ message: 'Введите число!' })
    .min(settingsDefaults[inputName].min, `Число должно быть больше ${settingsDefaults[inputName].min - 1}!`)
    .max(settingsDefaults[inputName].max, `Число должно быть меньше ${settingsDefaults[inputName].max + 1}!`)
}

const zSchema = z.object({
  ...schemaNumberInputsNames.reduce((acc, current) => {
    return { ...acc, [current]: createZNumberInput(current) }
  }, {}),
})

// TODO: remove vee-validate, or pass all inputs (checkboxes and selects) through vee-validate too and make submit on blur
const schema = toTypedSchema(zSchema)

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
    setValues(newState as any, false) // TODO: WATAFAK? z.infer<typeof zSchema> not works, придумать something!!!
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
  if (Object.values(errors.value).length > 0)
    return

  settingsStore.$patch(newValues)
  doneMessage.value = 'Настройки сохранены!'
  isShowDoneMessageTimeout.start()
})
</script>

<template>
  <div>
    <ul>
      <li class="verticalLi">
        <button class="colorsTransition btn" :disabled="Object.values(errors).length > 0" @click="handleSave()">
          Сохранить настройки
        </button>
        <button class="colorsTransition btn" @click="handleAllReset()">
          Сбросить настройки
        </button>
        <div v-show="!!doneMessage">
          {{ doneMessage }}
        </div>
      </li>
      <li>
        <span>Выберите цвет:</span>
        <select v-model="settingsStore.brandColor" name="brandColor" placeholder="Выберите" class="max-w-42 w-full inline-block">
          <option v-for="color in colorsList" :key="color" :value="color">
            {{ color }}
          </option>
        </select>
        <button class="colorsTransition btn" @click="settingsStore.brandColorReset()">
          Сброс
        </button>
        <button class="colorsTransition btn block" @click="toogleShowColorsTable()">
          {{ showColorsTable ? "Закрыть" : "Открыть" }} справку
        </button>
      </li>
      <li v-if="showColorsTable">
        <div>
          <div v-for="color in colors" :key="color.name" class="flex">
            <span class="text-xs w-16 inline-block">{{ color.name }}</span>
            <div class="flex">
              <span v-for="[oneColorKey, oneColorValue] in Object.entries(color.value).sort((a, b) => (a[0] === 'DEFAULT' ? -1 : parseInt(a[0]) - parseInt(b[0])))" :key="color.name + oneColorKey" :style="`background-color: ${oneColorValue};`" class="text-xs text-white h-8 w-8 inline-block [text-shadow:_1px_1px_1px_rgba(0,0,0,1)]">{{ oneColorKey.replaceAll('DEFAULT', 'DFLT') }}</span>
            </div>
          </div>
        </div>
      </li>
      <li>
        <Checkbox v-model="settingsStore.isColorizeBackground" checkbox-label="Раскрашивать фон" />
      </li>
      <li>
        <span>Прозрачность раскраски ({{ settingsDefaults.backgroundColorizationOpacity.min }} - {{ settingsDefaults.backgroundColorizationOpacity.max }}):</span>
        <InputTextValidated name="backgroundColorizationOpacity" type="number" class="inline-block" />
      </li>
      <li><Checkbox v-model="settingsStore.isOpenNewTab" checkbox-label="Открывать каналы в новой вкладке" /></li>
      <li>
        <Checkbox v-model="settingsStore.isShowChannelsImages" checkbox-label="Показывать картинки каналов" />
      </li>
      <li>
        <span>Размер картинок каналов ({{ settingsDefaults.channelsImagesSize.min }} - {{ settingsDefaults.channelsImagesSize.max }}):</span>
        <InputTextValidated name="channelsImagesSize" type="number" class="inline-block" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isShowPrograms" checkbox-label="Показывать программы" />
      </li>
      <li>
        <span>Выберите режим списка:</span>
        <select v-model="settingsStore.channelsListMode" name="channelsListMode" placeholder="Выберите" class="max-w-42 w-full inline-block">
          <option v-for="mode in Object.entries(channelsListModesNames)" :key="mode[0]" :value="mode[0]">
            {{ mode[1] }}
          </option>
        </select>
      </li>
      <li>
        <Checkbox v-model="settingsStore.isShowProgramOverlays" checkbox-label="Показывать инфо о передачах вместо лого канала при наведении" />
      </li>
      <li>
        <span>Дебаунс ТВ клавиатуры в секундах ({{ settingsDefaults.tvKeyboardDebounce.min }} - {{ settingsDefaults.tvKeyboardDebounce.max }}):</span>
        <InputTextValidated name="tvKeyboardDebounce" type="number" class="inline-block" />
      </li>
      <li>
        <span>Задержка выключения ТВ клавиатуры в секундах ({{ settingsDefaults.tvKeyboardHideTime.min }} - {{ settingsDefaults.tvKeyboardHideTime.max }}):</span>
        <InputTextValidated name="tvKeyboardHideTime" type="number" class="inline-block" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isRealtimePrograms" checkbox-label="Постоянно обновлять программы" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isShowProgramPopups" checkbox-label="Показывать всплывающие подсказки при наведении на название/время передачи" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isSortChannelsByFavorite" checkbox-label="Сортировать каналы по избранности задом наперед (почему?)" />
      </li>
      <li>
        <Checkbox v-model="settingsStore.isHideLogosOnSmallScreen" checkbox-label="Скрывать лого каналов на маленьких экранах" />
      </li>
      <li>
        <RouterLink class="colorsTransition btn btn-with-icon" to="/available_channels_settings">
          <span
            class="colorsTransition i-tabler:list text-inherit"
          />Просмотр доступных номеров каналов
        </RouterLink>
        <p>Редактируется через исходный код в репозитории.</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  @apply my-4 p-2 gap-2 border-l-solid border-l-4 border-brand-500 w-full flex flex-wrap items-center;
}

li.verticalLi {
  @apply flex-col items-start;
}
</style>
