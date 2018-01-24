import { shallow } from 'vue-test-utils'
import Css from './resources/Css.vue'

test('processes .vue file with Css style', () => {
  const wrapper = shallow(Css)
  expect(wrapper.classes()).toContain('testA')
  expect(wrapper.classes()).toContain('testB')
})
