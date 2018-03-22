import { shallow } from 'vue-test-utils'
import Stylus from './resources/Stylus.vue'
import StylusRelative from './resources/StylusRelative.vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import jestVue from '../vue-jest'

describe('processes .vue file with Stylus style', () => {
  let wrapper
  beforeAll(() => {
    wrapper = shallow(Stylus)
  })

  it('should bind from style tags with named module', () => {
    expect(wrapper.classes()).toContain('testA')
  })

  it('should bind from style tags with anonymous modules', () => {
    expect(wrapper.classes()).toContain('testB')
  })

  it('should not bind from style tags without a module', () => {
    expect(wrapper.vm.$style.testC).toBeFalsy()
  })

  it('should handle relative imports', () => {
    expect(() => shallow(StylusRelative)).not.toThrow()
  })

  it('does not attempty to compile if experimentalStyles flag is passed', () => {
    const filePath = resolve(__dirname, './resources/Basic.vue')
    const fileString = readFileSync(filePath, { encoding: 'utf8' })
    const fileStringWithInvalidSass = `
      ${fileString}
      <style lang="stylus">@something</style>
    `
    jestVue.process(fileStringWithInvalidSass, filePath, { globals: { 'vue-jest': { experimentalCSSCompile: false }}})
  })
})
