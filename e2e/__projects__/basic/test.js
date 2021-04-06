import { createApp, h } from 'vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import BasicSrc from './components/BasicSrc.vue'
import TsSrc from './components/TsSrc.vue'
import Pug from './components/Pug.vue'
import Coffee from './components/Coffee.vue'
import Basic from './components/Basic.vue'
import TypeScript from './components/TypeScript.vue'
import jestVue from '../../../'
import RenderFunction from './components/RenderFunction.vue'
import FunctionalSFC from './components/FunctionalSFC.vue'
import CoffeeScript from './components/CoffeeScript.vue'
import FunctionalSFCParent from './components/FunctionalSFCParent.vue'
import NoScript from './components/NoScript.vue'
import PugRelative from './components/PugRelativeExtends.vue'
import { randomExport } from './components/NamedExport.vue'
import ScriptSetup from './components/ScriptSetup.vue'

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

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

  expect(code).toMatchSnapshot()
})

test('generates source maps using src attributes', () => {
  const filePath = resolve(__dirname, './components/SourceMapsSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

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
