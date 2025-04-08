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
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
})
