import { mount } from 'vue-test-utils'
import NoScript from './resources/NoScript.vue'

describe('NoScript', () => {
  it('renders', () => {
    const wrapper = mount(NoScript)
    expect(wrapper.contains('footer'))
  })
})
