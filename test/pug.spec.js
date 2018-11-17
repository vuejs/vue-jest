import { shallowMount } from '@vue/test-utils'
import Pug from './resources/Pug.vue'
import PugRelative from './resources/PugRelativeExtends.vue'
import PugExtends from './resources/PugExtends.vue'

test('processes .vue file with pug template', () => {
  const wrapper = shallowMount(Pug)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.classes()).toContain('pug')
})

test('supports global pug options and extends templates correctly from .pug files', () => {
  const wrapper = shallowMount(PugExtends)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.find('.pug-extended').exists()).toBeTruthy()
})

test('supports relative paths when extending templates from .pug files', () => {
  const wrapper = shallowMount(PugRelative)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.find('.pug-relative-base').exists()).toBeTruthy()
})
