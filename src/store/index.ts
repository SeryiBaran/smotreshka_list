import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

function createMyPinia() {
  const pinia = createPinia()
  const persistedStatePlugin = createPersistedStatePlugin({
    persist: false,
  })
  pinia.use(persistedStatePlugin)
  return pinia
}

export { createMyPinia }
