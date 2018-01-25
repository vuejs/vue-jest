import { shallow } from 'vue-test-utils'
import Stylus from './resources/Stylus.vue'

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
})
