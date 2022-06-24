import { mount } from '@vue/test-utils'
import Entry from './components/Entry.vue'

test('processes sass imports relative to current file', () => {
  const wrapper = mount(Entry)
  expect(wrapper).toBeDefined()
})
