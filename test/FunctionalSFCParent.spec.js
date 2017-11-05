import { mount } from 'vue-test-utils'
import FunctionalSFCParent from './resources/FunctionalSFCParent.vue'

test('processes .vue file with functional template from parent', () => {
  const wrapper = mount(FunctionalSFCParent)
  expect(wrapper.text().trim()).toBe('foo')
})
