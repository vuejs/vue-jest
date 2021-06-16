import { mount } from '@vue/test-utils'
import TypeScript from './components/TypeScript.vue'
import Basic from './components/Basic.vue'
import Coffee from './components/Coffee.vue'

test('processes .vue files', () => {
  const wrapper = mount(Basic)
  wrapper.vm.toggleClass()
})

test('processes .vue file with lang set to coffee', () => {
  const wrapper = mount(Coffee)
  expect(wrapper.vm).toBeTruthy()
})

test('processes .vue files with lang set to typescript', () => {
  const wrapper = mount(TypeScript)
  expect(wrapper.vm).toBeTruthy()
})
