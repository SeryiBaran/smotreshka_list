import type { ModalID } from '~/types'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('smotreshka_list__modal', () => {
  const openedModals = ref<ModalID[]>([])

  function openedModalsSetOrToggle(modalId: ModalID, setBool?: boolean) {
    if (openedModals.value.includes(modalId) || !setBool) {
      openedModals.value = openedModals.value.filter(modalIdListed => modalIdListed !== modalId)
    }
    else {
      openedModals.value.push(modalId)
    }
  }

  // ...

  return {
    openedModals,
    openedModalsSetOrToggle,
  }
})
