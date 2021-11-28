import { createApp, h } from 'vue'

import PropsDestructureTransform from '@/components/PropsDestructureTransform.vue'

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

test('support additional compiler options like `propsDestructureTransform`', () => {
  // `propsDestructureTransform` is a new compiler option in v3.2.20
  // that allows to destructure props with default values and retain reactivity
  // The option is passed to the compiler via `globals.vue-jest.compilerOptions` of the Jest config in the package.json
  mount(PropsDestructureTransform)
  // if the option is properly passed, then the default value of the props is used
  expect(document.querySelector('h1')!.textContent).toBe('name')
})
