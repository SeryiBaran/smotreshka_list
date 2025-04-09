import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'

import { router } from '~/router'
import { pinia } from '~/store'
import App from './App.vue'

import 'uno.css'
import 'vue-final-modal/style.css'
import './styles/main.css'

const app = createApp(App)

const vfm = createVfm()

app.use(router)
app.use(pinia)
app.use(vfm)

app.mount('#app')
