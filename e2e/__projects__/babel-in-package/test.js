import { mount } from '@vue/test-utils'
import TypeScript from './components/TypeScript.vue'
import Basic from './components/Basic.vue'
import Coffee from './components/Coffee.vue'
import CoffeeScript from './components/CoffeeScript.vue'

test('processes .vue files', () => {
  const wrapper = mount(Basic)
  wrapper.vm.toggleClass()
})

test('processes .vue file with lang set to coffee', () => {
  mount(Coffee)
})

test('processes .vue file with lang set to coffeescript', () => {
  mount(CoffeeScript)
})

test('processes .vue files with lang set to typescript', () => {
  const wrapper = mount(TypeScript)
  expect(wrapper.vm).toBeTruthy()
})
