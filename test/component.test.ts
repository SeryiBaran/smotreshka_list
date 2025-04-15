// import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
// import TheCounter from '../src/components/TheCounter.vue'

// TODO: Write tests
// TODO: Write tests with mocks with https://mswjs.io/docs/recipes/vitest-browser-mode
describe('component of TheCounter.vue', () => {
  // it('should render', () => {
  //   const wrapper = mount(TheCounter, { props: { initial: 10 } })
  //   expect(wrapper.text()).toContain('10')
  //   expect(wrapper.html()).toMatchSnapshot()
  // })

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
