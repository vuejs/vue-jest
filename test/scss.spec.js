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
  let wrapper
  beforeEach(() => {
    wrapper = shallow(SassModule)
  })
  it('does inject classes to $style', () => {
    expect(wrapper.vm.$style).toBeDefined()
    expect(wrapper.vm.$style.testA).toBeDefined()
    expect(wrapper.vm.$style.testB).toBeDefined()
  })

  describe('entrypoint: direct import in SFC', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(SassModule)
    })
    it('does inject classes from directly imported files by relative path', () => {
      expect(wrapper.vm.$style.directImportClass).toBeDefined()
    })
    it('does inject classes from directly imported files via moduleNameMapper', () => {
      expect(wrapper.vm.$style.directImportModuleNameMapperClass).toBeDefined()
    })
    it('does inject classes from directly imported files via moduleNameMapper for more than one rule', () => {
      expect(wrapper.vm.$style.directImportMultipleModuleNameMapperClass).toBeDefined()
    })
    it('does inject classes from files imported recursively by relative path', () => {
      expect(wrapper.vm.$style.globalClassesRelativeDirect).toBeDefined()
    })
    it('does inject classes from files imported recursively via moduleNameMapper', () => {
      expect(wrapper.vm.$style.globalClassesModuleNameMapperDirect).toBeDefined()
    })
  })

  describe('entrypoint: import inside previously imported stylesheet', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(SassModule)
    })
    it('does inject classes from imports within scss files by relative path', () => {
      expect(wrapper.vm.$style.scssImportClass).toBeDefined()
    })
    it('does inject classes from imports within scss files via moduleNameMapper', () => {
      expect(wrapper.vm.$style.scssImportModuleNameMapperClass).toBeDefined()
    })
    it('does inject classes from imports within scss files via moduleNameMapper for more than one rule', () => {
      expect(wrapper.vm.$style.scssImportMultipleModuleNameMapperClass).toBeDefined()
    })
    it('does inject classes from imports within scss files imported recursively by relative path', () => {
      expect(wrapper.vm.$style.globalClassesRelative).toBeDefined()
    })
    it('does inject classes from imports within scss files imported recursively via moduleNameMapper', () => {
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toBeDefined()
    })
  })

  describe('multiple modules', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(SassModule)
    })
    it('does inject classes from scss if multiple modules are present', () => {
      expect(wrapper.vm.$style.directImportSecondClass).toBeDefined()
    })
  })
})
