import { PiniaColada } from '@pinia/colada'
import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import { router } from '~/router'
import { createMyPinia } from '~/store'
import App from './App.vue'

import 'uno.css'
import 'vue-final-modal/style.css'
import 'floating-vue/dist/style.css'
import './styles/main.css'

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_MOCK !== 'true') {
    return
  }

  const { mockBrowserWorker } = await import('~/mocks/browser')

  return mockBrowserWorker.start({
    onUnhandledRequest: 'bypass',
  })
}

const app = createApp(App)

const vfm = createVfm()

app.use(router)
app.use(createMyPinia())
app.use(PiniaColada, {})
app.use(vfm)
app.use(FloatingVue)

enableMocking().then(() => {
  app.mount('#app')
})

// TODO: https://vuejs.org/guide/best-practices/accessibility.html
// TODO: show fetching errors!

// TODO: Make setting like "load from tab: " and values: GenreID | SPECIAL_GENRES
// TODO: Set font of channels numbers to JetBrains Mono
// TODO: Make genres tabs as Vue Router pages (maybe)
