import { shallow } from 'vue-test-utils'
import Pug from './resources/Pug.vue'

test('processes .vue file with pug template', () => {
  const wrapper = shallow(Pug)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.hasClass('pug')).toBe(true)
})
