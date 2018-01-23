import { shallow } from 'vue-test-utils'
import Stylus from './resources/Stylus.vue'

test('processes .vue file with Stylus style', () => {
  const wrapper = shallow(Stylus)
  expect(wrapper.classes()).toContain('testA')
  expect(wrapper.classes()).toContain('testB')
})
