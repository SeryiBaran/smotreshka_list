import type { GenreID, UnoCSSColorName } from '~/types'

export const defaultFavoriteGenres: GenreID[] = ['federal', 'kids', 'movies']

export const defaultBrandColor: UnoCSSColorName = 'orange'
export const defaultIsColorizeBackground = false
export const defaultBackgroundColorizationOpacity = {
  min: 1,
  max: 40,
  step: 1,
  default: 5,
}

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

export const defaultChannelsImagesSize = {
  min: 48,
  max: 1920,
  step: 1,
  default: 240,
}

export const defaultIsShowInfoOnHover = false

export const defaultTvKeyboardDebounce = {
  min: 1,
  max: 10,
  step: 1,
  default: 5,
}

export const defaultTvKeyboardHideTime = {
  min: 1,
  max: 10,
  step: 1,
  default: 3,
}

export const defaultIsRealtimePrograms = false

export const defaultIsShowProgramPopups = false

export const defaultSearchDebounce = 500

export const settingsDefaults = {
  brandColor: defaultBrandColor,
  isColorizeBackground: defaultIsColorizeBackground,
  channelsImagesSize: defaultChannelsImagesSize,
  channelsListMode: defaultChannelsListMode,
  favoriteGenres: defaultFavoriteGenres,
  isOpenNewTab: defaultIsOpenNewTab,
  isRealtimePrograms: defaultIsRealtimePrograms,
  isShowChannelsImages: defaultIsShowChannelsImages,
  isShowInfoOnHover: defaultIsShowInfoOnHover,
  isShowPrograms: defaultIsShowPrograms,
  tvKeyboardDebounce: defaultTvKeyboardDebounce,
  tvKeyboardHideTime: defaultTvKeyboardHideTime,
  isShowProgramPopups: defaultIsShowProgramPopups,
  backgroundColorizationOpacity: defaultBackgroundColorizationOpacity,
  searchDebounce: defaultSearchDebounce,
}
