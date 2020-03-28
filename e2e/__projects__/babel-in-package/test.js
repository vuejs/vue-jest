import { createApp, h } from 'vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import TypeScript from './components/TypeScript.vue'
import Basic from './components/Basic.vue'
import Coffee from './components/Coffee.vue'

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
  const app = createApp(Parent).mount(el)
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
  const wrapper = mount(TypeScript)
  expect(document.querySelector('#parent').textContent).toBe('Parent')
  expect(document.querySelector('#child').textContent).toBe('Child')
})
