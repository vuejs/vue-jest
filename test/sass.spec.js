import { shallowMount, mount } from '@vue/test-utils'
import Sass from './resources/Sass.vue'
import SassModule from './resources/SassModule.vue'
import SassModuleFunctional from './resources/SassModuleFunctional.vue'

describe('processes .vue file with sass style', () => {
  it('does not error on sass', () => {
    expect(() => shallowMount(Sass)).not.toThrow()
  })
  it('does not error on sass module', () => {
    expect(() => shallowMount(SassModule)).not.toThrow()
  })
  it('does not error on sass module when functional', () => {
    expect(() => mount(SassModuleFunctional)).not.toThrow()
  })
})

describe('processes .vue files which combine sass and modules', () => {
  let wrapper
  let functionalWrapper

  beforeEach(() => {
    wrapper = shallowMount(SassModule)
    functionalWrapper = mount(SassModuleFunctional)
  })

  it('does inject classes to $style', () => {
    expect(wrapper.vm.$style).toBeDefined()
    expect(wrapper.vm.$style.testA).toBeDefined()
    expect(wrapper.vm.$style.testA).toEqual('testA')
    expect(wrapper.vm.$style.testB).toBeDefined()
    expect(wrapper.vm.$style.testB).toEqual('testB')
  })

  it('does inject classes to $style for functional components', () => {
    expect(functionalWrapper.findAll('.testAFunctional')).toHaveLength(3)
    expect(functionalWrapper.findAll('.testBFunctional')).toHaveLength(2)
    expect(functionalWrapper.findAll('.otherTestAFunctional')).toHaveLength(1)
    expect(functionalWrapper.findAll('.otherTestBFunctional')).toHaveLength(1)
  })

  describe('entrypoint: direct import in SFC', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SassModule)
    })
    it('does inject classes from directly imported files by relative path', () => {
      expect(wrapper.vm.$style.directImportClass).toBeDefined()
      expect(wrapper.vm.$style.directImportClass).toEqual('directImportClass')
    })
    it('does inject classes from directly imported files via moduleNameMapper', () => {
      expect(wrapper.vm.$style.directImportModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.directImportModuleNameMapperClass).toEqual('directImportModuleNameMapperClass')
    })
    it('does inject classes from directly imported files via moduleNameMapper for more than one rule', () => {
      expect(wrapper.vm.$style.directImportMultipleModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.directImportMultipleModuleNameMapperClass).toEqual('directImportMultipleModuleNameMapperClass')
    })
    it('does inject classes from files imported recursively by relative path', () => {
      expect(wrapper.vm.$style.globalClassesRelativeDirect).toBeDefined()
      expect(wrapper.vm.$style.globalClassesRelativeDirect).toEqual('globalClassesRelativeDirect')
    })
    it('does inject classes from files imported recursively via moduleNameMapper', () => {
      expect(wrapper.vm.$style.globalClassesModuleNameMapperDirect).toBeDefined()
      expect(wrapper.vm.$style.globalClassesModuleNameMapperDirect).toEqual('globalClassesModuleNameMapperDirect')
    })
  })

  describe('entrypoint: import inside previously imported stylesheet', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SassModule)
    })
    it('does inject classes from imports within sass files by relative path', () => {
      expect(wrapper.vm.$style.sassImportClass).toBeDefined()
      expect(wrapper.vm.$style.sassImportClass).toEqual('sassImportClass')
    })
    it('does inject classes from imports within sass files via moduleNameMapper', () => {
      expect(wrapper.vm.$style.sassImportModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.sassImportModuleNameMapperClass).toEqual('sassImportModuleNameMapperClass')
    })
    it('does inject classes from imports within sass files via moduleNameMapper for more than one rule', () => {
      expect(wrapper.vm.$style.sassImportMultipleModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.sassImportMultipleModuleNameMapperClass).toEqual('sassImportMultipleModuleNameMapperClass')
    })
    it('does inject classes from imports within sass files imported recursively by relative path', () => {
      expect(wrapper.vm.$style.globalClassesRelative).toBeDefined()
      expect(wrapper.vm.$style.globalClassesRelative).toEqual('globalClassesRelative')
    })
    it('does inject classes from imports within sass files imported recursively via moduleNameMapper', () => {
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toBeDefined()
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toEqual('globalClassesModuleNameMapper')
    })
  })

  describe('multiple modules', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(SassModule)
    })
    it('does inject classes from sass if multiple modules are present', () => {
      expect(wrapper.vm.$style.directImportSecondClass).toBeDefined()
      expect(wrapper.vm.$style.directImportSecondClass).toEqual('directImportSecondClass')
    })
  })
})
