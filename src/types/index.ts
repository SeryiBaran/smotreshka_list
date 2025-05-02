import type { unoPresetColors } from '~/shared'

export * from './Channel'
export * from './Programs'

export type UnoCSSColorName = keyof typeof unoPresetColors
export type UnoCSSColorObj = typeof unoPresetColors[UnoCSSColorName]

export type Entries<T> = [keyof T, T[keyof T]][]
export type Keys<T> = (keyof T)[]
export type Values<T> = (T[keyof T])[]
