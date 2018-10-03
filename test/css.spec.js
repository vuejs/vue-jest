import { shallowMount } from '@vue/test-utils'
import Css from './resources/Css.vue'

describe('processes .vue file with Css style', () => {
  let wrapper
  beforeAll(() => {
    wrapper = shallowMount(Css)
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
})
