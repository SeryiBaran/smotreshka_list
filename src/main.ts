import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import 'uno.css'
import './styles/main.css'

const app = createApp(App)
const router = createRouter({
  routes,
  history: createWebHashHistory(),
})
app.use(router)
app.mount('#app')
