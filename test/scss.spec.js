import { shallow } from 'vue-test-utils'
import Sass from './resources/Sass.vue'
import SassModule from './resources/SassModule.vue'

describe('processes .vue file with scss style', () => {
  it('does not error on scss/sass', () => {
    expect(() => shallow(Sass)).not.toThrow()
  })
  it('does not error on scss/sass module', () => {
    expect(() => shallow(SassModule)).not.toThrow()
  })
})

describe('processes .vue files which combine scss/sass and modules', () => {
  it('does inject classes to $style', () => {
    const wrapper = shallow(SassModule)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$style).toBeDefined()
    expect(wrapper.vm.$style.testA).toBeDefined()
    expect(wrapper.vm.$style.testB).toBeDefined()
  })
})
