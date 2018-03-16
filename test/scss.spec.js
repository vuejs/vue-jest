import { shallow } from 'vue-test-utils'
import Sass from './resources/Sass.vue'
import SassModule from './resources/SassModule.vue'

describe('processes .vue file with scss style', () => {
  it('does not error on scss or sass', () => {
    const wrapper = shallow(Sass)
    expect(wrapper.classes()).toContain('testA')
  })

  it('does not error on scss/sass module', () => {
    expect(() => shallow(SassModule)).not.toThrow()
  })
})
