import { colors as colorsPreset } from '@unocss/preset-wind4/colors'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { defaultBrandColor } from './src/shared'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: {
          name: 'Roboto',
          weights: [300, 400, 600, 700, 800],
        },
        serif: 'DM Serif Display',
        mono: 'JetBrains Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      ...colorsPreset,
      brand: colorsPreset[defaultBrandColor],
    },
  },
})
