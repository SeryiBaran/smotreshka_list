import dayjs from 'dayjs'
import localeRu from 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createApp } from 'vue'

import { router } from '~/router'
import { pinia } from '~/store'
import App from './App.vue'

import 'uno.css'
import './styles/main.css'

dayjs.extend(relativeTime)
dayjs.locale(localeRu)

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
