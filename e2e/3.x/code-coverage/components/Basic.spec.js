import { shallowMount } from '@vue/test-utils'

import Basic from './Basic.vue'

describe('Basic', () => {
  it('collects test coverage', () => {
    expect.assertions(4)

    const wrapper = shallowMount(Basic)
    const div = wrapper.find('div')
    const h1 = wrapper.find('h1')

    expect(wrapper.element).toMatchSnapshot()
    expect(div.attributes('class')).toBe('hello')
    expect(h1.attributes('class')).toBe('blue')
    expect(h1.text()).toBe('Hello World')
  })
})
