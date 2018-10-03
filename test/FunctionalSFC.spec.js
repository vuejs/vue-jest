import { shallowMount } from '@vue/test-utils'
import FunctionalSFC from './resources/FunctionalSFC.vue'

let wrapper
const clickSpy = jest.fn()
beforeEach(() => {
  wrapper = shallowMount(FunctionalSFC, {
    context: {
      props: { msg: { id: 1, title: 'foo' }, onClick: clickSpy }
    }
  })
})

describe('Processes .vue file with functional template', () => {
  it('with nested props', () => {
    expect(wrapper.text().trim()).toBe('foo')
  })

  it('with callback prop', () => {
    wrapper.trigger('click')
    expect(clickSpy).toHaveBeenCalledWith(1)
  })

  it('is functional', () => {
    expect(wrapper.isFunctionalComponent).toBe(true)
  })

  it('handles slot', () => {
    wrapper = shallowMount(FunctionalSFC, {
      context: {
        props: { msg: { id: 1, title: '' }},
        children: ['this is a slot']
      }
    })

    expect(wrapper.text()).toBe('this is a slot')
  })
})
