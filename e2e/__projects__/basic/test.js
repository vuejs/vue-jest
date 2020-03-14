import BasicSrc from './components/BasicSrc.vue'
import Coffee from './components/Coffee.vue'
import Basic from './components/Basic.vue'
import TypeScript from './components/TypeScript.vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
// import jestVue from 'vue-jest'
import RenderFunction from './components/RenderFunction.vue'
import Jade from './components/Jade.vue'
import FunctionalSFC from './components/FunctionalSFC.vue'
import CoffeeScript from './components/CoffeeScript.vue'
import FunctionalSFCParent from './components/FunctionalSFCParent.vue'
import NoScript from './components/NoScript.vue'
import Pug from './components/Pug.vue'
import PugRelative from './components/PugRelativeExtends.vue'
// TODO: Figure this out
// import { randomExport } from './components/NamedExport.vue'
// TODO: JSX for Vue 3? TSX?
// import Jsx from './components/Jsx.vue'
// TODO: Is Vue.extend even a thing anymore?
// import Constructor from './components/Constructor.vue'

const { createApp } = require('vue')

function mount(Component) {
  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)
  const app = createApp(Component).mount(el)
}

xtest('processes .vue files', () => {
  mount(Basic)
  expect(document.querySelector('h1').textContent).toBe('Welcome to Your Vue.js App')
})

test('processes .vue files with src attributes', () => {
  mount(BasicSrc)
  expect(document.querySelector('h1').textContent).toBe('Welcome to Your Vue.js App')
})

xtest('handles named exports', () => {
  expect(randomExport).toEqual(42)
})

xtest('generates source maps for .vue files', () => {
  const filePath = resolve(__dirname, './components/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

  expect(code).toMatchSnapshot()
})

xtest('generates source maps using src attributes', () => {
  const filePath = resolve(__dirname, './components/SourceMapsSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

  expect(code).toMatchSnapshot()
})

xtest('processes .vue file using jsx', () => {
  const wrapper = mount(Jsx)
  expect(wrapper.is('div')).toBeTruthy()
})

xtest('processes extended functions', () => {
  const wrapper = mount(Constructor)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes .vue file with lang set to coffee', () => {
  mount(Coffee)
  expect(document.querySelector('h1').textContent).toBe('Welcome to Your Vue.js App')
})

test('processes .vue file with lang set to coffeescript', () => {
  mount(CoffeeScript)
  expect(document.querySelector('h1').textContent).toBe('Welcome to Your Vue.js App')
})

test('processes .vue files with lang set to typescript', () => {
  const wrapper = mount(TypeScript)
  expect(document.querySelector('#parent').textContent).toBe('Parent')
  expect(document.querySelector('#child').textContent).toBe('Child')
})

// TODO: How do functional components work in Vue 3?
xtest('processes functional components', () => {
  const clickSpy = jest.fn()
  mount(FunctionalSFC)
  console.log(document.body.outerHTML)
  //expect(wrapper.text().trim()).toBe('foo')
  // expect(clickSpy).toHaveBeenCalledWith(1)
})

// TODO: this one too
xtest('processes SFC with functional template from parent', () => {
  mount(FunctionalSFCParent)
  expect(document.querySelector('div').textContent).toBe('foo')
  // expect(wrapper.text().trim()).toBe('foo')
})

test('handles missing script block', () => {
  mount(NoScript)
  expect(document.querySelector('.footer').textContent).toBe("I'm footer!")
})

xtest('processes .vue file with jade template', () => {
  const wrapper = mount(Jade)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.classes()).toContain('jade')
})

xtest('processes pug templates', () => {
  const wrapper = mount(Pug)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.classes()).toContain('pug-base')
  expect(wrapper.find('.pug-extended').exists()).toBeTruthy()
})

xtest('supports relative paths when extending templates from .pug files', () => {
  const wrapper = mount(PugRelative)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.find('.pug-relative-base').exists()).toBeTruthy()
})

xtest('processes SFC with no template', () => {
  const wrapper = mount(RenderFunction)
  expect(wrapper.is('section')).toBe(true)
})
