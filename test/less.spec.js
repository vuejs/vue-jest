import { shallow } from 'vue-test-utils'
import Less from './resources/Less.vue'

describe('processes .vue file with Less style', () => {
  it('does not error on less', () => {
    const wrapper = shallow(Less)
    expect(wrapper.classes()).toContain('testLess')
  })
})
