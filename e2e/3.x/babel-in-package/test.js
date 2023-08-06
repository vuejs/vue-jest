import { createApp, h } from 'vue'

import TypeScript from './components/TypeScript.vue'
import Basic from './components/Basic.vue'
import Coffee from './components/Coffee.vue'
import Tsx from './components/Tsx.vue'

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

test('processes .vue files', () => {
  mount(Basic)
  expect(document.querySelector('h1').textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('processes .vue file with lang set to coffee', () => {
  mount(Coffee)
  expect(document.querySelector('h1').textContent).toBe('Coffee')
})

test('processes .vue files with lang set to typescript', () => {
  mount(TypeScript)
  expect(document.querySelector('#parent').textContent).toBe('Parent')
  expect(document.querySelector('#child').textContent).toBe('Child')
})

test('processes .vue files with lang set to tsx(typescript)', () => {
  mount(Tsx)
  expect(document.querySelector('div').textContent).toContain('tsx components')
})
