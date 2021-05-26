import { createApp, h, nextTick } from 'vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import BasicSrc from './components/BasicSrc.vue'
import TsSrc from './components/TsSrc.vue'
import Pug from './components/Pug.vue'
import Coffee from './components/Coffee.vue'
import Basic from './components/Basic.vue'
import ClassComponent from './components/ClassComponent.vue'
import ClassComponentWithMixin from './components/ClassComponentWithMixin.vue'
import ClassComponentProperty from './components/ClassComponentProperty.vue'
import TypeScript from './components/TypeScript.vue'
import jestVue from 'vue3-jest'
import RenderFunction from './components/RenderFunction.vue'
import FunctionalSFC from './components/FunctionalSFC.vue'
import CoffeeScript from './components/CoffeeScript.vue'
import FunctionalSFCParent from './components/FunctionalSFCParent.vue'
import NoScript from './components/NoScript.vue'
import PugRelative from './components/PugRelativeExtends.vue'
import { randomExport } from './components/NamedExport.vue'
import ScriptSetup from './components/ScriptSetup.vue'
import FunctionalRenderFn from './components/FunctionalRenderFn.vue'

// TODO: JSX for Vue 3? TSX?
import Jsx from './components/Jsx.vue'

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

test('supports <script setup>', () => {
  mount(ScriptSetup)
  expect(document.body.outerHTML).toContain('Count: 5')
  expect(document.body.outerHTML).toContain('Welcome to Your Vue.js App')
})

test('processes .vue files', () => {
  mount(Basic)
  expect(document.querySelector('h1').textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('processes .vue files with js src attributes', () => {
  mount(BasicSrc)
  expect(document.querySelector('h1').textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('processes .vue files with ts src attributes', () => {
  mount(TsSrc)
  expect(document.querySelector('h1').textContent).toBe(
    'Welcome to Your Vue.js App'
  )
})

test('handles named exports', () => {
  expect(randomExport).toEqual(42)
})

test('generates source maps for .vue files', () => {
  const filePath = resolve(__dirname, './components/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const config = {
    moduleFileExtensions: ['js', 'vue']
  }

  const { code } = jestVue.process(fileString, filePath, { config })

  expect(code).toMatchSnapshot()
})

test('generates source maps using src attributes', () => {
  const filePath = resolve(__dirname, './components/SourceMapsSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const config = {
    moduleFileExtensions: ['js', 'vue']
  }

  const { code } = jestVue.process(fileString, filePath, { config })

  expect(code).toMatchSnapshot()
})

test('processes .vue file with lang set to coffee', () => {
  mount(Coffee)
  expect(document.querySelector('h1').textContent).toBe('Coffee')
})

test('processes .vue file with lang set to coffeescript', () => {
  mount(CoffeeScript)
  expect(document.querySelector('h1').textContent).toBe('CoffeeScript')
})

test('processes SFC with no template', () => {
  mount(RenderFunction, {}, { default: () => h('div', { id: 'slot' }) })
  expect(document.querySelector('#slot')).toBeTruthy()
})

test('processes .vue files with lang set to typescript', () => {
  mount(TypeScript)
  expect(document.querySelector('#parent').textContent).toBe('Parent')
  expect(document.querySelector('#child').textContent).toBe('Child')
})

test('handles missing script block', () => {
  mount(NoScript)
  expect(document.querySelector('.footer').textContent).toBe("I'm footer!")
})

test('processes pug templates', () => {
  mount(Pug)
  expect(document.querySelector('.pug-base')).toBeTruthy()
  expect(document.querySelector('.pug-extended')).toBeTruthy()
})

test('supports relative paths when extending templates from .pug files', () => {
  mount(PugRelative)
  expect(document.querySelector('.pug-relative-base')).toBeTruthy()
})

test('supports class component .vue files', () => {
  expect.assertions(3)
  mount(ClassComponent, { msg: 'Props Message' })
  expect(document.querySelector('[data-computed]').textContent).toBe(
    'Message: Props Message'
  )
  expect(document.querySelector('[data-props]').textContent).toBe(
    'Props Message'
  )
  const event = new window.Event('click')
  document.querySelector('button').dispatchEvent(event)
  nextTick().then(() => {
    expect(document.querySelector('[data-methods]').textContent).toBe('Updated')
  })
})

test('supports class component .vue files with mixins', () => {
  expect.assertions(1)
  mount(ClassComponentWithMixin)
  expect(document.querySelector('[data-mixin]').textContent).toBe(
    'Hello world!'
  )
})

test('supports class component .vue files using vue-property-decorator', () => {
  expect.assertions(2)
  mount(ClassComponentProperty, { msg: 'Props Message' })
  expect(document.querySelector('[data-computed]').textContent).toBe(
    'Message: Hello'
  )
  expect(document.querySelector('[data-props]').textContent).toBe(
    'Props Message'
  )
})

// TODO: How do functional components work in Vue 3?
xtest('processes functional components', () => {
  // const clickSpy = jest.fn()
  mount(FunctionalSFC)
})

// TODO: How do functional components work in Vue 3?
xtest('processes SFC with functional template from parent', () => {
  mount(FunctionalSFCParent)
  expect(document.querySelector('div').textContent).toBe('foo')
})

// TODO: JSX in Vue 3?
xtest('processes .vue file using jsx', () => {
  mount(Jsx)
  expect(document.querySelector('#jsx')).toBeTruthy()
})

test('processes functional component exported as function', () => {
  mount(FunctionalRenderFn)

  const elem = document.querySelector('#functional-render-fn')
  expect(elem).toBeTruthy()
  expect(elem.innerHTML).toBe('Nyan')
})
