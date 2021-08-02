import { mount } from '@vue/test-utils'

import Less from './components/Less.vue'
import Stylus from './components/Stylus.vue'
import Scss from './components/Scss.vue'
import Sass from './components/Sass.vue'
import PostCss from './components/PostCss.vue'
import External from './components/External.vue'

test('processes Less', () => {
  const wrapper = mount(Less)
  expect(wrapper.vm.$style.a).toEqual('a')
})

test('processes PostCSS', () => {
  const wrapper = mount(PostCss)
  expect(wrapper.vm.$style.c).toEqual('c')
  expect(wrapper.vm.$style.d).toEqual('d')
})

test('processes Sass', () => {
  const wrapper = mount(Sass)
  expect(wrapper.vm.$style.a).toEqual('a')
  expect(wrapper.vm.$style.b).toEqual('b')
  expect(wrapper.vm.$style.c).toEqual('c')
  expect(wrapper.vm.$style.light).toBeUndefined()
})

test('processes SCSS with resources', () => {
  const wrapper = mount(Scss)
  expect(wrapper.vm.$style.a).toEqual('a')
  expect(wrapper.vm.$style.b).toEqual('b')
  expect(wrapper.vm.$style.c).toEqual('c')
})

test('process Stylus', () => {
  const wrapper = mount(Stylus)
  expect(wrapper.vm).toBeTruthy()
  expect(wrapper.vm.css.a).toEqual('a')
  expect(wrapper.vm.$style.b).toEqual('b')
})

test('process External', () => {
  const wrapper = mount(External)
  expect(wrapper.vm).toBeTruthy()
  expect(wrapper.vm.$style.testClass).toEqual('testClass')
  expect(wrapper.vm.css.a).toEqual('a')
})
