import type { RouteNamedMap } from 'vue-router/auto-routes'
import type { GenreID } from '~/types'

export { colors as unoPresetColors } from '@unocss/preset-wind4/colors'

export const defaultBrandColor = 'orange'
export const defaultFavoriteGenres: GenreID[] = ['federal', 'kids']

interface RouteName {
  url: keyof RouteNamedMap
  title: string
}

export const routesNames: RouteName[] = [
  { url: '/', title: 'Список каналов' },
  { url: '/settings', title: 'Настройки' },
]
