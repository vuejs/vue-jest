import { createApp, h } from 'vue'

import Basic from '@/components/Basic.vue'

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
