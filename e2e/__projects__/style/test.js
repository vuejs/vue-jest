import { mount } from '@vue/test-utils'
import Stylus from './components/Stylus.vue'
import Scss from './components/Scss.vue'
import Sass from './components/Sass.vue'
import Less from './components/Less.vue'
import PostCss from './components/PostCss.vue'

test('processes Less', () => {
  const wrapper = mount(Less)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes PostCSS', () => {
  const wrapper = mount(PostCss)
  expect(wrapper.is('section')).toBeTruthy()
  expect(wrapper.vm.$style.red).toEqual('red')
  expect(wrapper.html()).toMatchSnapshot()
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
})
