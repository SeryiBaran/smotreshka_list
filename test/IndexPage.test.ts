import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useFiltersStore } from '~/store/filters'
import { useSettingsStore } from '~/store/settings'
import IndexPage from '../src/pages/index.vue'
import { beforeTestsShared, myMount, sleep } from './shared'

// TODO: write tests!
// TODO: break big tests to many small!
// TODO: optimize time, now one test runs 100ms

function getCurrentChannelsNames(wrapper: VueWrapper) {
  const channelsItems = wrapper.findAll('#channelsList .channelsItem')
  expect(channelsItems.length).toBeGreaterThan(0)

  return channelsItems.map(el => el.find('.channelName').text())
}

describe('indexPage', () => {
  beforeTestsShared()

  it('should render', async () => {
    const wrapper = myMount(IndexPage)

    expect(wrapper.text()).toContain('Вы можете начать вводить номер канала прямо на странице')
  })

  it('channels list should work', async () => {
    const wrapper = myMount(IndexPage)

    await flushPromises()

    expect(getCurrentChannelsNames(wrapper)).toStrictEqual(['Тримуна 7', 'Канябуна кАНАЛ', 'Кубынина 62'])
  })

  it('channels search should work', async () => {
    const wrapper = myMount(IndexPage)

    const settingsStore = useSettingsStore()
    const filtersStore = useFiltersStore()

    await flushPromises()

    const searchBar = wrapper.find<HTMLInputElement>('input.searchBar')
    const filtersClearBtn = wrapper.find<HTMLInputElement>('button#filtersClearBtn')

    expect(searchBar.exists()).toBeTruthy()
    expect(filtersClearBtn.exists()).toBeTruthy()

    expect(getCurrentChannelsNames(wrapper)).toStrictEqual(['Тримуна 7', 'Канябуна кАНАЛ', 'Кубынина 62'])

    settingsStore.searchDebounce = 5

    let previousSearchValue = filtersStore.searchValue
    let previousSearchValueDebouncedTrimmed = filtersStore.searchValueDebouncedTrimmed
    const initialChannelsNames = getCurrentChannelsNames(wrapper)

    async function testSearch(text: string, result: string[]) {
      expect(filtersStore.searchValue).toBe(previousSearchValue)
      expect(filtersStore.searchValueDebouncedTrimmed).toBe(previousSearchValueDebouncedTrimmed)

      await searchBar.setValue(text)

      expect(filtersStore.searchValue).toBe(text)
      expect(filtersStore.searchValueDebouncedTrimmed).toBe(previousSearchValueDebouncedTrimmed)

      await sleep(settingsStore.searchDebounce)

      expect(filtersStore.searchValue).toBe(text)
      expect(filtersStore.searchValueDebouncedTrimmed).toBe(text.trim())

      expect(getCurrentChannelsNames(wrapper)).toStrictEqual(result)

      previousSearchValue = filtersStore.searchValue
      previousSearchValueDebouncedTrimmed = filtersStore.searchValueDebouncedTrimmed
    }

    await testSearch('бунаи  ', ['Канябуна кАНАЛ', 'Кубынина 62', 'Тримуна 7'])
    await testSearch('  тримуна', ['Тримуна 7', 'Канябуна кАНАЛ'])

    await filtersClearBtn.trigger('click')

    await sleep(50) // TODO: replace this shitcode `sleep` with something else

    expect(getCurrentChannelsNames(wrapper)).toStrictEqual(initialChannelsNames)
  })

  // TODO: write favoriteGenres test
  it('genres should work', async () => {
    const wrapper = myMount(IndexPage)

    await flushPromises()

    const genresButtons = wrapper.findAll<HTMLButtonElement>('button.genreButtonGenre')
    const filtersClearBtn = wrapper.find<HTMLInputElement>('button#filtersClearBtn')

    expect(genresButtons.length).toBeGreaterThan(0)
    expect(filtersClearBtn.exists()).toBeTruthy()

    expect(getCurrentChannelsNames(wrapper)).toStrictEqual(['Тримуна 7', 'Канябуна кАНАЛ', 'Кубынина 62'])

    const initialChannelsNames = getCurrentChannelsNames(wrapper)

    async function testGenres(title: string, result: string[]) {
      const btn = genresButtons.find(btn => btn.text() === title)

      expect(btn).toBeDefined()

      await btn?.trigger('click')

      expect(getCurrentChannelsNames(wrapper)).toStrictEqual(result)
    }

    await testGenres('Новостные', ['Кубынина 62'])
    await testGenres('Федеральные', ['Тримуна 7', 'Канябуна кАНАЛ'])

    await filtersClearBtn.trigger('click')

    expect(getCurrentChannelsNames(wrapper)).toStrictEqual(initialChannelsNames)
  })

  // TODO: make epg popup tests
  // it('epg popup should work', async () => {
  // })

  // it('should be interactive', async () => {
  //   const wrapper = mount(TheCounter, { props: { initial: 0 } })
  //   expect(wrapper.text()).toContain('0')

  //   expect(wrapper.find('.inc').exists()).toBe(true)

  //   await wrapper.get('button').trigger('click')

  //   expect(wrapper.text()).toContain('1')
  // })
  it('very useful test', () => {
    expect(1 + 1).toBe(2)
  })
})
