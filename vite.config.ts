/// <reference types="vitest" />

import path from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue'
import { simpleGit } from 'simple-git'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

import 'dotenv/config'

const log = await simpleGit().log()

// I will not write fucking loop for 2 fucking lines of code, fuck off
process.env.VITE_APPGITVER_HASH = log.latest ? log.latest.hash : 'NO_HASH'
process.env.VITE_APPGITVER_DATE = log.latest ? log.latest.date : 'NO_DATE'

export default defineConfig({
  // Else MSW not working
  base:
    process.env.VITEST
    || (process.env.NODE_ENV === 'development' && process.env.VITE_API_MOCK === 'true')
      ? '/'
      : '/smotreshka_list',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        }),
      },
    }),

    // https://github.com/posva/unplugin-vue-router
    VueRouter(),

    // https://github.com/antfu/unplugin-auto-import
    // AutoImport({
    //   imports: [
    //     'vue',
    //     '@vueuse/core',
    //     VueRouterAutoImports,
    //     {
    //       // add any other imports you were relying on
    //       'vue-router/auto': ['useLink'],
    //     },
    //   ],
    //   dts: true,
    //   dirs: [
    //     './src/composables',
    //   ],
    //   vueTemplate: true,
    // }),

    // https://github.com/antfu/vite-plugin-components
    // Components({
    //   dts: true,
    // }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    vueDevTools(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
