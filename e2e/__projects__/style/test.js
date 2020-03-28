// TODO: Support styles
//
import { createApp, h } from 'vue'

import Stylus from './components/Stylus.vue'
import Scss from './components/Scss.vue'
import Sass from './components/Sass.vue'
import Less from './components/Less.vue'
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

xtest('processes Less', () => {
  mount(Less)
  // expect(wrapper.is('div')).toBeTruthy()
  // expect(wrapper.vm.$style.a).toEqual('a')
})

xtest('processes PostCSS', () => {
  mount(PostCss)
  // expect(wrapper.is('section')).toBeTruthy()
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

xtest('processes Sass', () => {
  mount(Sass)
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
  // expect(wrapper.vm.$style.light).toBeUndefined()
})

xtest('processes SCSS with resources', () => {
  mount(Scss)
  // expect(wrapper.vm.$style.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
  // expect(wrapper.vm.$style.c).toEqual('c')
})

xtest('process Stylus', () => {
  mount(Stylus)
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.css.a).toEqual('a')
  // expect(wrapper.vm.$style.b).toEqual('b')
})

xtest('process External', () => {
  mount(External)
  // expect(wrapper.vm).toBeTruthy()
  // expect(wrapper.vm.$style.xtestClass).toEqual('xtestClass')
  // expect(wrapper.vm.css.a).toEqual('a')
})
