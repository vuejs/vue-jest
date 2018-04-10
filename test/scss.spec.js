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
  it('does inject classes from scss imported in SFC', () => {
    const wrapper = shallow(SassModule)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$style.vueImportClass).toBeDefined()
    expect(wrapper.vm.$style.vueImportModuleNameMapperClass).toBeDefined()
    it('and injects imports therein if specified relatively', () => {
      const wrapper = shallow(SassModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$style.globalClassesRelativeSfc).toBeDefined()
    })
    it('and injects imports therein if specified via moduleNameMapper', () => {
      const wrapper = shallow(SassModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$style.globalClassesModuleNameMapperSfc).toBeDefined()
    })
  })
  it('does inject classes from scss imported from within scss', () => {
    const wrapper = shallow(SassModule)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$style.scssImportClass).toBeDefined()
    expect(wrapper.vm.$style.scssImportModuleNameMapperClass).toBeDefined()
    it('and injects imports therein if specified relatively', () => {
      const wrapper = shallow(SassModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$style.globalClassesRelative).toBeDefined()
    })
    it('and injects imports therein if specified via moduleNameMapper', () => {
      const wrapper = shallow(SassModule)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toBeDefined()
    })
  })
})
