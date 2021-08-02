import { mount } from '@vue/test-utils'
import Scss from './components/Scss.vue'

test('processes SCSS using user specified post transforms', () => {
  const wrapper = mount(Scss)
  expect(wrapper.vm.$style.light.a).toBeUndefined()
  expect(wrapper.vm.$style.light.f).toEqual('f')
  expect(wrapper.vm.$style.dark.f).toEqual('f')
  expect(wrapper.vm.$style.dark.g).toEqual('g')
})

test('processes SCSS using user specified pre transforms', () => {
  const wrapper = mount(Scss)
  expect(wrapper.vm.$style.g).toEqual('g')
})
