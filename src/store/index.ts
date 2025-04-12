import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
const persistedStatePlugin = createPersistedStatePlugin({
  persist: false,
})
pinia.use(persistedStatePlugin)

export { pinia }
