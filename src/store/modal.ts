import { defineStore } from 'pinia'
import { ref } from 'vue'
import { maxModals } from '~/shared'

export type ModalID = string

export interface Modal {
  id: ModalID
  isActive: boolean
}

export const useModalStore = defineStore('smotreshka_list__modal', () => {
  const openedModals = ref<Modal[]>([])

  function setOrToggleModal(modalId: ModalID, newValue: boolean | null = null) {
    const findIndexResult = openedModals.value.findIndex(modal => modal.id === modalId)
    const needSetActive = newValue !== null ? newValue : !openedModals.value[findIndexResult].isActive
    if (!needSetActive) {
      openedModals.value = openedModals.value.filter(modal => modal.id !== modalId)
    }
    if (needSetActive) {
      if (!(findIndexResult >= 0)) {
        openedModals.value.push({
          id: modalId,
          isActive: true,
        })
      }
      else {
        openedModals.value[findIndexResult].isActive = true
      }
      if (openedModals.value.filter(modal => modal.isActive).length > maxModals) {
        openedModals.value.shift()
      }
    }
  }

  function getIsActive(modalId: ModalID) {
    return openedModals.value.findIndex(modal => modal.id === modalId) >= 0
  }

  // ...

  return {
    openedModals,
    setOrToggleModal,
    getIsActive,
  }
})
