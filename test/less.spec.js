import { shallow } from 'vue-test-utils'
import Less from './resources/Less.vue'
import LessModule from './resources/LessModule.vue'

describe('processes .vue file with Less style', () => {
  it('does not error on less', () => {
    const wrapper = shallow(Less)
    expect(wrapper.classes()).toContain('testLess')
  })

  it('does not error on less module', () => {
    expect(() => shallow(LessModule)).not.toThrow()
  })
})
