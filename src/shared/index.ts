import type { GenreID, TimeInterval, UnoCSSColorObj } from '~/types'

import dayjs from 'dayjs'

export { colors as unoPresetColors } from '@unocss/preset-wind4/colors'

export const channelsPacksNames = {
  basic: 'Базовый',
  kids: 'Детский',
}

export const channelsPacks = {
  basic: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 25, 28, 29, 30, 35, 41, 42, 43, 48, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 61, 62, 64, 66, 67, 85, 101, 104, 123, 128, 135, 142, 151, 152, 186, 187, 189, 206, 207, 215, 217, 219, 220, 222, 224, 228, 229, 245, 309, 329, 330, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 523, 524, 526, 527, 528, 530, 531, 532, 533, 534, 535, 536, 537, 540, 541, 542, 543, 544, 547, 548, 549, 550, 552, 614, 627, 647, 649, 653, 657, 661, 662, 663, 664, 665, 667, 670, 672, 673, 674, 710, 716, 717, 718, 720, 730, 731, 734, 737, 738, 739, 745, 746, 747, 753, 754, 755, 756, 758, 761, 806, 807, 808, 811, 813, 814, 815, 821, 822, 823, 824, 825, 826, 828, 834, 835, 836, 837, 908, 909, 910, 911, 912, 913, 914, 916, 917, 920, 922, 924, 926, 927, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 948, 949],
  kids: [8, 23, 48, 187, 306, 307, 308, 309, 310, 311, 312, 313, 314, 316, 317, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332],
}

export const denyBrandColors = ['white', 'black', 'light', 'dark']

export const defaultFavoriteGenres: GenreID[] = ['federal', 'kids', 'movies']
export const defaultBrandColor = 'orange'
export const defaultIsOpenNewTab = true
export const defaultIsShowChannelsImages = true
export const defaultIsShowPrograms = true
export const defaultIsCompactChannels = false

export const channelsListModesNames = {
  list: 'Список',
  compact: 'Компактный',
  logos: 'Логотипы',
}

export type ChannelsListMode = keyof typeof channelsListModesNames

export const defaultChannelsListMode: ChannelsListMode = 'list'

export const defaultChannelsImagesSizeMin = 48
export const defaultChannelsImagesSizeMax = 1920
export const defaultChannelsImagesSize = 400

export function createFaviconSvg(color: UnoCSSColorObj) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28"><rect width="100%" height="100%" fill="${color[100]}" rx="4" /><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path transform="translate(3 3)" fill="none" stroke="${color[700]}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4m7 4v13m3-5v.01M18 12v.01"/></svg>`
}

export function createFaviconUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function isCurrentProgram(scheduledFor: TimeInterval) {
  return dayjs().isAfter(dayjs(scheduledFor.begin)) && dayjs().isBefore(dayjs(scheduledFor.end))
}
