import { shallow } from 'vue-test-utils'
import FunctionalSFC from './resources/FunctionalSFC.vue'

let wrapper
const clickSpy = jest.fn()
beforeEach(() => {
  wrapper = shallow(FunctionalSFC, {
    propsData: { msg: { id: 1, title: 'foo' }, onClick: clickSpy }
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
})
