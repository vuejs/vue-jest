import { createApp, h } from 'vue'

import Basic from './components/Basic.vue'
import BindCss from './components/BindCss.vue'

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
  const app = createApp(Parent)
  app.directive('test', el => el.setAttribute('data-test', 'value'))
  app.mount(el)
}

test('processes .vue files', () => {
  mount(Basic)
  expect(document.querySelector('h1').textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('process .vue with v-bind(css) in style block', () => {
  mount(BindCss)

  expect(document.querySelector('.testA').textContent).toBe('100px')
  expect(document.querySelector('.testB').textContent).toBe('100px')
  expect(document.querySelector('.testC').textContent).toBe('100px')
})
