import type { RouteNamedMap } from 'vue-router/auto-routes'

import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

interface RouteName {
  url: keyof RouteNamedMap
  title: string
}

export const routesNames: RouteName[] = [
  { url: '/', title: 'Список каналов' },
  { url: '/settings', title: 'Настройки' },
  { url: '/available_channels_settings', title: 'Просмотр доступных номеров каналов' },
  { url: '/help', title: 'Справка' },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
})
