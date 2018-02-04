import { shallow } from 'vue-test-utils'
import Sass from './resources/Sass.vue'

describe('processes .vue file with Stylus style', () => {
  it('does not error on scss or sass', () => {
    const wrapper = shallow(Sass)
    expect(wrapper.classes()).toContain('testA')
  })
})
