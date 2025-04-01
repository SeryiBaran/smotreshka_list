import { colors as colorsPreset } from '@unocss/preset-wind4/colors'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { defaultBrandColor, unoPreset } from './src/shared'

export default defineConfig({
  presets: [
    unoPreset(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      brand: colorsPreset[defaultBrandColor],
    },
  },
})
