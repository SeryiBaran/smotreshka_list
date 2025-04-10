<script lang="ts" setup>
import img__newtab_guide_0 from '~/assets/newtab_guide_0.jpg'
import img__newtab_guide_1 from '~/assets/newtab_guide_1.jpg'
import img__newtab_guide_2 from '~/assets/newtab_guide_2.jpg'
</script>

<template>
  <div>
    <ul class="ml-4 list-circle">
      <li>
        <p>Если не работает открытие канала при наборе номера, и вверху браузера пишется "Всплывающее окно заблокировано", нажмите на эту надпись/иконку и разрешите всплывающие окна для этого сайта. Перезагрузите страницу и все должно заработать</p>
        <p><img :src="img__newtab_guide_2" alt="Скриншот" class="helpImg"></p>
        <p><img :src="img__newtab_guide_1" alt="Скриншот" class="helpImg"></p>
        <p><img :src="img__newtab_guide_0" alt="Скриншот" class="helpImg"></p>
      </li>
      <li>
        <p>Чтобы обновить список доступных каналов, в коде сайта в `src/shared/index.ts` в `channelsPacks` в список `basic` надо добавить номера новых каналов. Там же можно удалить старые.</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  @apply mt-4;
}

.helpImg {
  @apply border-solid border-2 border-brand-500 mt-2;
}
</style>
