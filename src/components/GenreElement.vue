<script lang="ts" setup>
interface Props {
  isActive: boolean
  isFavorite: boolean
  genreName: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isFavorite: false,
})

const emit = defineEmits<{
  toggleActive: []
  toggleFavorite: []
}>()
</script>

<template>
  <div
    class="genreGroup flex" :class="{
      active: props.isActive,
      favorite: props.isFavorite,
    }"
  >
    <button class="colorsTransition genreButton genreButtonGenre" @click="() => emit('toggleActive')">
      {{ genreName }}
    </button>
    <button class="genreButton colorsTransition genreButtonFavorite" @click="() => emit('toggleFavorite')">
      <span
        class="colorsTransition genreButtonFavoriteIcon i-tabler:heart" :class="{ 'i-tabler:heart-filled': props.isFavorite,
        }"
      />
    </button>
  </div>
</template>

<style scoped>
.genreButton {
  @apply cursor-pointer px-3 py-0.5 border border-2 border-transparent rounded-full dark:bg-brand-500/10 bg-brand-500/13 hover:(dark:bg-brand-500/18 bg-brand-500/21);
}

.genreGroup.active .genreButton {
  @apply border-brand-500 dark:bg-brand-500/30 bg-brand-500/33;
}

.genreButtonGenre {
  @apply rounded-rt-0 rounded-rb-0;
}

.genreButtonFavorite {
  @apply rounded-lt-0 rounded-lb-0 px-2 pl-1.5;
}

.genreButtonFavoriteIcon {
  @apply h-1em w-1em block;
}

.genreGroup.favorite .genreButtonFavorite .genreButtonFavoriteIcon {
  @apply text-brand-500;
}

.genreButtonFavorite:not(.active .genreButtonFavorite, .genreGroup.favorite .genreButtonFavorite) {
  @apply border-transparent;
}

.genreGroup.active.favorite .genreButtonFavorite {
  @apply border-brand-500;
}

.genreGroup.active .genreButtonFavorite {
  @apply border-l-transparent!;
}
</style>
