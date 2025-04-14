import { PiniaColada } from '@pinia/colada'
import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'

import { router } from '~/router'
import { pinia } from '~/store'
import App from './App.vue'

import 'uno.css'
import 'vue-final-modal/style.css'
import 'floating-vue/dist/style.css'
import './styles/main.css'

const app = createApp(App)

const vfm = createVfm()

app.use(router)
app.use(pinia)
app.use(PiniaColada, {})
app.use(vfm)
app.use(FloatingVue)

app.mount('#app')
