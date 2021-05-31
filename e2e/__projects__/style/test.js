// TODO: Support styles
//
import { createApp, h } from 'vue'

import Less from './components/Less.vue'
import Stylus from './components/Stylus.vue'
import Scss from './components/Scss.vue'
import Sass from './components/Sass.vue'
import PostCss from './components/PostCss.vue'
import External from './components/External.vue'

function mount(Component, props, slots) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
  const Parent = {
    render() {
      return h(Component, props, slots)
    }
  }
  createApp(Parent).mount(el)
}

test('processes Less', () => {
  mount(Less)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<div><div class="a">a</div><div class="b">b</div></div>'
  )
})

test('processes PostCSS', () => {
  mount(PostCss)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<section><div class="c"></div><div class="d"></div></section>'
  )
  // expect(wrapper.is('section')).toBeTruthy()
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

test('processes Sass', () => {
  mount(Sass)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<div><div class="a"></div><div class="b"></div><div class="c"></div><div class=""></div><div class="e"></div></div>'
  )
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
  // expect(wrapper.vm.$style.light).toBeUndefined()
})

test('processes SCSS with resources', () => {
  mount(Scss)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<div><div class="a"></div><div class="b"></div><div class="c"></div><div class=""></div><div class=""></div><div class="f"></div></div>'
  )
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
})

test('process Stylus', () => {
  mount(Stylus)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<div><div class="a"></div><div class="b"></div></div>'
  )
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.css.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

test('process External', () => {
  mount(External)
  expect(document.getElementById('app').innerHTML).toEqual(
    '<div class="testClass"><div class="a"></div></div>'
  )
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.$style.xtestClass).toEqual('xtestClass')
  // expect(wrapper.vm.css.a).toEqual('a')
})
