import { shallow } from 'vue-test-utils'
import FunctionalSFC from './resources/FunctionalSFC.vue'

test('processes .vue file with functional template', () => {
  const wrapper = shallow(FunctionalSFC, {
    propsData: { msg: 'Hello' }
  })
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.text().trim()).toBe('Hello')
})
