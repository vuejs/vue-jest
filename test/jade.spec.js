import { shallow } from 'vue-test-utils'
import Jade from './resources/Jade.vue'

test('processes .vue file with jade template', () => {
  const wrapper = shallow(Jade)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.hasClass('jade')).toBe(true)
})
