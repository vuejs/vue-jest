import { shallowMount } from '@vue/test-utils'
import RenderFunction from './resources/RenderFunction.vue'

test('processes .vue file with no template', () => {
  const wrapper = shallowMount(RenderFunction)

  expect(wrapper.is('section')).toBe(true)
})
