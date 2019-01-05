import { mount } from '@vue/test-utils'
import TypeScript from './resources/TypeScript.vue'

test('processes .vue files', () => {
  const wrapper = mount(TypeScript)
  expect(wrapper.vm).toBeTruthy()
})
