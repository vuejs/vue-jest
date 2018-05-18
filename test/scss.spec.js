import { shallow, mount } from 'vue-test-utils'
import Scss from './resources/Scss.vue'
import ScssModule from './resources/ScssModule.vue'
import ScssModuleFunctional from './resources/ScssModuleFunctional.vue'

describe('processes .vue file with scss style', () => {
  it('does not error on scss', () => {
    expect(() => shallow(Scss)).not.toThrow()
  })
  it('does not error on scss module', () => {
    expect(() => shallow(ScssModule)).not.toThrow()
  })
  it('does not error on scss module when functional', () => {
    expect(() => mount(ScssModuleFunctional)).not.toThrow()
  })
})

describe('processes .vue files which combine scss and modules', () => {
  let wrapper
  let functionalWrapper

  beforeEach(() => {
    wrapper = shallow(ScssModule)
    functionalWrapper = mount(ScssModuleFunctional)
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
      wrapper = shallow(ScssModule)
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
      wrapper = shallow(ScssModule)
    })
    it('does inject classes from imports within scss files by relative path', () => {
      expect(wrapper.vm.$style.scssImportClass).toBeDefined()
      expect(wrapper.vm.$style.scssImportClass).toEqual('scssImportClass')
    })
    it('does inject classes from imports within scss files via moduleNameMapper', () => {
      expect(wrapper.vm.$style.scssImportModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.scssImportModuleNameMapperClass).toEqual('scssImportModuleNameMapperClass')
    })
    it('does inject classes from imports within scss files via moduleNameMapper for more than one rule', () => {
      expect(wrapper.vm.$style.scssImportMultipleModuleNameMapperClass).toBeDefined()
      expect(wrapper.vm.$style.scssImportMultipleModuleNameMapperClass).toEqual('scssImportMultipleModuleNameMapperClass')
    })
    it('does inject classes from imports within scss files imported recursively by relative path', () => {
      expect(wrapper.vm.$style.globalClassesRelative).toBeDefined()
      expect(wrapper.vm.$style.globalClassesRelative).toEqual('globalClassesRelative')
    })
    it('does inject classes from imports within scss files imported recursively via moduleNameMapper', () => {
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toBeDefined()
      expect(wrapper.vm.$style.globalClassesModuleNameMapper).toEqual('globalClassesModuleNameMapper')
    })
  })

  describe('multiple modules', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(ScssModule)
    })
    it('does inject classes from scss if multiple modules are present', () => {
      expect(wrapper.vm.$style.directImportSecondClass).toBeDefined()
      expect(wrapper.vm.$style.directImportSecondClass).toEqual('directImportSecondClass')
    })
  })
})
