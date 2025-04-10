<script lang="ts" setup>
import type { Channel } from '~/types'
import { makeChannelPlayLink, maxTvKeyboardKeyNumberLength } from '~/shared'
import { useModalStore } from '~/store/modal'

// TODO: move channels into pinia
const props = defineProps<{
  channelsAvailable: Channel[]
}>()

// oh shit

const modalStore = useModalStore()

const showOverlay = ref(false)
const numbers = ref<number[]>([])

const overlayError = ref<string | null>(null)

function cancelTvKeyboard() {
  showOverlay.value = false
  numbers.value = []
  overlayError.value = null
}

const tvKeyboardHideTimer = useTimeoutFn(() => {
  cancelTvKeyboard()
}, 3000, { immediate: false })

const keyNumber = computed(() => Number.parseInt(numbers.value.join('')) || 0)
const structuredKeyNumber = computed(() => {
  return {
    unused: Array.from({ length: maxTvKeyboardKeyNumberLength - (keyNumber.value.toString().length) }, (_, i) => i),
    used: keyNumber.value.toString().split(''),
  }
})

const ignoreTags = ['SELECT', 'INPUT', 'TEXTAREA']

function playChannel() {
  const channel = props.channelsAvailable.find(channel => channel.keyNumber === keyNumber.value)

  if (channel) {
    const link = makeChannelPlayLink(channel.id)

    window.open(link, '_blank')
  }
  else {
    overlayError.value = 'Такого канала нет или он недоступен :('
  }

  if (overlayError.value) {
    tvKeyboardHideTimer.start()
  }
  else {
    cancelTvKeyboard()
  }
}

const debouncedPlayNumber = useDebounceFn(() => {
  playChannel()
}, 5000)

const allowedTvKeyboardKeys = Array.from({ length: 10 }, (_, i) => i.toString())

onKeyStroke([...allowedTvKeyboardKeys, 'Escape', 'Enter', 'Backspace'], (event: KeyboardEvent) => {
  if (modalStore.openedModals.length > 0)
    return

  tvKeyboardHideTimer.stop()
  overlayError.value = null
  if (allowedTvKeyboardKeys.includes(event.key) && document.activeElement?.tagName && !ignoreTags.includes(document.activeElement.tagName)) {
    event.preventDefault()

    showOverlay.value = true

    if (numbers.value.length >= maxTvKeyboardKeyNumberLength) {
      numbers.value.shift()
    }
    numbers.value.push(Number(event.key))

    debouncedPlayNumber()
  }
  if (event.key === 'Escape') {
    event.preventDefault()

    cancelTvKeyboard()
  }
  if (event.key === 'Enter') {
    event.preventDefault()

    playChannel()
  }
  if (event.key === 'Backspace') {
    event.preventDefault()

    numbers.value.pop()
  }
})

const findChannelResult = computed(() => props.channelsAvailable.find(channel => channel.keyNumber === keyNumber.value))
</script>

<template>
  <div v-if="showOverlay" class="tvKeyboardOverlay">
    <div class="flex flex-col gap-2 max-w-md items-center">
      <div class="rounded-4 bg-neutral-200 overflow-hidden dark:bg-neutral-800">
        <p class="text-8xl text-black font-mono px-4 py-2 bg-brand-500/20 dark:text-white">
          <span v-for="(unusedNumber, i) in structuredKeyNumber.unused" :key="unusedNumber.toString() + unusedNumber + i" class="opacity-50">-</span>
          <span v-for="(usedNumber, i) in structuredKeyNumber.used" :key="usedNumber.toString() + usedNumber + i">{{ usedNumber }}</span>
        </p>
      </div>
      <p class="text-brand-500">
        {{ findChannelResult ? findChannelResult.title : '...' }}
      </p>
      <p v-if="overlayError" class="text-red">
        {{ overlayError }}
      </p>
      <ul class="list-circle">
        <li>Отмена - <kbd>ESC</kbd></li>
        <li>Открыть сразу - <kbd>Enter <span class="i-tabler:corner-down-left text-size-base inline-block" /></kbd></li>
        <li>Стереть - <kbd>Backspace <span class="i-tabler:backspace text-size-base inline-block" /></kbd></li>
        <li>
          Если не работает, <RouterLink to="/help" class="link">
            разрешите сайту открывать всплывающие окна и вкладки
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tvKeyboardOverlay {
  @apply fixed top-0 right-0 bottom-0 left-0 bg-neutral-900/85 flex items-center justify-center z-10 text-white;
}
</style>
