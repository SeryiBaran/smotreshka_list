<script lang="ts" setup>
const lastScrollY = ref<number | null>(null)
const directionToTop = ref<boolean>(true)
const myIsScrolling = ref<boolean>(false)

const { y, directions } = useWindowScroll({
  onScroll(_e) {
    if (directions.bottom && !directionToTop.value) {
      directionToTop.value = true
    }
  },
  onStop(_e) {
    if (myIsScrolling.value) {
      directionToTop.value = !directionToTop.value
      myIsScrolling.value = false
    }
  },
})

function handleToTopClick() {
  if (directionToTop.value) {
    const previous = y.value
    if (previous !== 0) {
      lastScrollY.value = y.value
      y.value = 0
      directionToTop.value = false
    }
  }
  else if (lastScrollY.value !== null) {
    const previous = y.value
    y.value = lastScrollY.value
    if (previous !== y.value) {
      directionToTop.value = true
    }
  }
}
</script>

<template>
  <button v-show="true || (lastScrollY !== null) || (directionToTop && (y > 100)) || !directionToTop" class="text-white p-4 rounded-full bg-brand-500 cursor-pointer bottom-4 right-4 fixed dark:bg-brand-700" @click="() => handleToTopClick()">
    <span class="i-tabler:arrow-up h-10 w-10 block" :class="{ directionToBottom: !directionToTop }" />
  </button>
</template>

<style scoped>
.directionToBottom {
  @apply rotate-180;
}
</style>
