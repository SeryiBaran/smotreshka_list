import type { Component } from 'vue'
import { PiniaColada } from '@pinia/colada'
import { mount } from '@vue/test-utils'
import FloatingVue from 'floating-vue'
import { setActivePinia } from 'pinia'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { createVfm } from 'vue-final-modal'
import { mockNodeServer } from '~/mocks/node'
import { router } from '~/router'
import { createMyPinia } from '~/store'

export function myMount(component: Component) {
  const vfm = createVfm()
  const wrapper = mount(component, {
    global: {
      plugins: [router, createMyPinia(), [PiniaColada, {}], vfm, FloatingVue],
    },
  })
  return wrapper
}

export function beforeTestsShared() {
  beforeAll(() => mockNodeServer.listen({
    onUnhandledRequest: 'bypass',
  }))
  afterEach(() => {
    mockNodeServer.resetHandlers()
    setActivePinia(createMyPinia())
  })
  afterAll(() => mockNodeServer.close())
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
