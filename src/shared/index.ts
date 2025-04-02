import type { RouteNamedMap } from 'vue-router/auto-routes'
import type { GenreID, UnoCSSColorObj } from '~/types'

export { colors as unoPresetColors } from '@unocss/preset-wind4/colors'

export const denyBrandColors = ['white', 'black', 'light', 'dark']

export const defaultFavoriteGenres: GenreID[] = ['federal', 'kids', 'movies']
export const defaultBrandColor = 'orange'
export const defaultIsOpenNewTab = true
export const defaultIsShowChannelsImages = true

interface RouteName {
  url: keyof RouteNamedMap
  title: string
}

export const routesNames: RouteName[] = [
  { url: '/', title: 'Список каналов' },
  { url: '/settings', title: 'Настройки' },
]

export function createFaviconSvg(color: UnoCSSColorObj) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28"><rect width="100%" height="100%" fill="${color[100]}" rx="4" /><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path transform="translate(3 3)" fill="none" stroke="${color[700]}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4m7 4v13m3-5v.01M18 12v.01"/></svg>`
}

export function createFaviconUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
