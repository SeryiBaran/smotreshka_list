import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,

    ignores: ['public/mockServiceWorker.js'],
  },
  {
    files: ['pnpm-workspace.yaml'],
    rules: {
      'pnpm/yaml-enforce-settings': ['error', {
        settings: { shellEmulator: true, trustPolicy: 'off', catalogMode: 'prefer' },
      }],
    },
  },
)
