import type { Dayjs } from 'dayjs'

import type { ChannelID, TimeInterval, UnoCSSColorObj, Values } from '~/types'
import { colors as unoPresetColors } from '@unocss/preset-wind4/colors'
import dayjs from 'dayjs'
import localeRu from 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale(localeRu)

export function useDayJS() {
  return dayjs
}

// TODO: write mocks with https://mswjs.io/docs/getting-started

export const appGitVerHash: string = import.meta.env.VITE_APPGITVER_HASH
export const appGitVerDate: string = import.meta.env.VITE_APPGITVER_DATE

export { unoPresetColors }

export const channelsPacksNames = {
  basic: 'Базовый',
  kids: 'Детский',
}

const channelsPacksLastEditString = '23.07.2025'
export const channelsPacksLastEdit = useDayJS()(channelsPacksLastEditString, 'DD.MM.YYYY')

export const channelsPacks = {
  basic: [],
  kids: [],
  pileOfShit: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 33, 34, 35, 41, 42, 43, 44, 45, 48, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 61, 62, 64, 65, 66, 67, 85, 100, 102, 103, 104, 105, 106, 107, 111, 112, 113, 114, 115, 119, 120, 121, 122, 123, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 186, 187, 189, 190, 191, 192, 193, 194, 195, 196, 197, 206, 207, 208, 209, 210, 215, 216, 217, 218, 219, 220, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 245, 306, 307, 308, 309, 310, 311, 312, 313, 314, 316, 317, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 404, 405, 406, 407, 408, 409, 410, 411, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 523, 524, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 540, 541, 542, 543, 544, 547, 548, 549, 550, 552, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 670, 671, 672, 673, 674, 675, 676, 677, 678, 705, 708, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 726, 727, 728, 729, 730, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 753, 754, 755, 756, 757, 758, 760, 761, 763, 806, 807, 808, 809, 810, 811, 812, 814, 815, 816, 817, 821, 822, 823, 824, 825, 826, 827, 828, 829, 831, 832, 833, 834, 835, 836, 837, 839, 907, 908, 909, 910, 911, 912, 913, 914, 916, 917, 920, 922, 926, 927, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 948, 949, 955, 957, 958],
}

export const availableChannelsNumbers = (Object.values(channelsPacks) as Values<typeof channelsPacks>)
  .reduce<number[]>((accumulator, e) => ([...accumulator, ...e]), [])

export const channelsFetchURL = 'https://fe.smotreshka.tv/tv/v2/channels?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjMsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbIjVlNzlmODI5Y2YxZDlkNWE5MTg4MmYxNyIsIjVmZDM5MDJlZTUwMDA3MGJhZTM5OGI4ZSIsIjYyMzllYjVlMjQ3Mzc4MjM2NmZkMWM2MCJdLCJyZWdpb24iOiJydS5jZW50cmFsLm1vc2NvdyIsImRldmljZV90eXBlIjoicGMiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MiwibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.TOWQtBXKEV1fqKyu_z1wHszfxRM71paqfAwKC38kLnY'

export const programsFetchURL = 'https://fe.smotreshka.tv/epg/v2/on-air?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJwaG9uZSIsIm5ldHdvcmtfYWZmaWxpYXRpb25fc3RhdHVzIjozLCJsb2NhbGUiOiJydSIsInByb2ZpbGVfdHlwZSI6MiwicHJvZmlsZV9yZXN0cmljdGlvbl92YWx1ZSI6M30.wB3RTIMXoURTU-j_afc3AIH575HhQMclIE8EMuJ1NSM'

export const programsComposeTableFetchURL = 'https://fe.smotreshka.tv/tv/v2/medias?tv-asset-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjQsInB1cmNoYXNlZF9jaGFubmVsX3BhY2thZ2VzIjpbXSwicmVnaW9uIjoiIiwiZGV2aWNlX3R5cGUiOiJ0YWJsZXQiLCJuZXR3b3JrX2FmZmlsaWF0aW9uX3N0YXR1cyI6MywibG9jYWxlIjoicnUiLCJwcm9maWxlX3R5cGUiOjIsInByb2ZpbGVfcmVzdHJpY3Rpb25fdmFsdWUiOjN9.jl_3Bn2iw7GRb7CCsj75XqbjJykPmRa655LBKQly8ds'

export const maxTvKeyboardKeyNumberLength = 3

export const programsRefetchTimeout = 1000 * 60 * 30

export const denyBrandColors = ['white', 'black', 'light', 'dark']

export * from './settingsDefaults'

export function createFaviconSvg(color: UnoCSSColorObj) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 28"><rect width="100%" height="100%" fill="${color[100]}" rx="4" /><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path transform="translate(3 3)" fill="none" stroke="${color[700]}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4m7 4v13m3-5v.01M18 12v.01"/></svg>`
}

export function createFaviconUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function isCurrentProgram(scheduledFor: TimeInterval, time?: Dayjs) {
  const usedTime = time || useDayJS()()
  return usedTime.isAfter(useDayJS()(scheduledFor.begin)) && usedTime.isBefore(useDayJS()(scheduledFor.end))
}

export function makeChannelPlayLink(channelId: ChannelID) {
  return `https://smotreshka.tv/channels/now/${channelId}/watch`
}

export function log(message: any, mode: 'info' | 'warn' | 'error' = 'info') {
  if (import.meta.env.DEV) {
    const colors = {
      info: unoPresetColors.blue['600'],
      warn: unoPresetColors.yellow['600'],
      error: unoPresetColors.red['600'],
    }

    // eslint-disable-next-line no-console
    console.log(
      `%c${mode.toLocaleUpperCase()}%c ${message}`,
      `background: ${colors[mode]}; color: ${unoPresetColors.white}; padding: 4px 6px;`,
      `background: inherit; color: inherit; padding: unset;`,
    )
  }
}

export function getTimeTo(scheduledFor: TimeInterval, timeToBegin: boolean, currentTime: Dayjs, withoutSuffix: boolean = false) {
  const timeFormatted = currentTime.to(useDayJS()(scheduledFor[timeToBegin ? 'begin' : 'end']), withoutSuffix)

  return timeFormatted[0].toLocaleUpperCase() + timeFormatted.slice(1)
}

// untested, dont change! leave `1`
export const maxModals = 1
