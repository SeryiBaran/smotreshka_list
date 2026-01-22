import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ChannelsItem from '~/components/ChannelsItem.vue'
import ChannelsItemEPGModal from '~/components/ChannelsItemEPGModal.vue'
import { useFiltersStore } from '~/store/filters'
import { useSettingsStore } from '~/store/settings'
import IndexPage from '../src/pages/index.vue'
import { beforeTestsShared, myMount, sleep } from './shared'

// TODO: view video about autotests from Yandex on HolyJS YT
// TODO: write tests!
// TODO: break big tests to many small!
// TODO: optimize time, now one test runs 100ms
// TODO: write tests for searchByProgram

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
})

describe('channels item', () => {
  it('epg popup should toggle', async () => {
    const wrapper = myMount(IndexPage)

    await flushPromises()

    const firstChannelsItem = wrapper.findComponent(ChannelsItem)
    const firstChannelsItemEPGBtn = firstChannelsItem.find('.showEpgBtn')

    expect(firstChannelsItem.exists()).toBeTruthy()
    expect(firstChannelsItemEPGBtn.exists()).toBeTruthy()

    async function testEPGPopupToggle(closeBtnClass: string) {
      expect(wrapper.findComponent(ChannelsItemEPGModal).exists()).toBeFalsy()

      await firstChannelsItemEPGBtn.trigger('click')

      await flushPromises()

      expect(wrapper.findComponent(ChannelsItemEPGModal).exists()).toBeTruthy()

      const modal = wrapper.findComponent(ChannelsItemEPGModal)
      const closeEpgBtn = modal.find(`.${closeBtnClass}`)

      expect(modal.exists()).toBeTruthy()
      expect(closeEpgBtn.exists()).toBeTruthy()

      await closeEpgBtn.trigger('click')

      expect(wrapper.findComponent(ChannelsItemEPGModal).exists()).toBeFalsy()
    }

    await testEPGPopupToggle('closeEpgBtnHeader')
    await testEPGPopupToggle('closeEpgBtnFooter')
  })
})

describe('channels list', () => {
  it('should work', async () => {
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
})
