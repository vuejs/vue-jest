import { createApp, h } from 'vue'

import Basic from '@/components/Basic.vue'
import ScriptSetup from '@/components/ScriptSetup.vue'

function mount(Component: any) {
  document.getElementsByTagName('html')[0].innerHTML = ''
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
  const Parent = {
    render() {
      return h(Component)
    }
  }
  createApp(Parent).mount(el)
}

test('processes .vue files', () => {
  mount(Basic)
  expect(document.querySelector('h1')!.textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('supports <script setup>', () => {
  mount(ScriptSetup)
  expect(document.body.outerHTML).toContain('Count: 5')
  expect(document.body.outerHTML).toContain('Welcome to Your Vue.js App')
})
