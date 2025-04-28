import { describe, expect, it } from 'vitest'
import IndexPage from '../src/pages/index.vue'
import { beforeTestsShared, myMount } from './shared'

// TODO: write tests!

describe('indexPage', () => {
  beforeTestsShared()

  it('should render', async () => {
    const wrapper = myMount(IndexPage)

    expect(wrapper.text()).toContain('Вы можете начать вводить номер канала прямо на странице')
  })

  // it('should be interactive', async () => {
  //   const wrapper = mount(TheCounter, { props: { initial: 0 } })
  //   expect(wrapper.text()).toContain('0')

  //   expect(wrapper.find('.inc').exists()).toBe(true)

  //   await wrapper.get('button').trigger('click')

  //   expect(wrapper.text()).toContain('1')
  // })
  it('should equal', () => {
    expect(1 + 1).toEqual(2)
  })
})
