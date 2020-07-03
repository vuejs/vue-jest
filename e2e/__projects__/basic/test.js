import { mount } from '@vue/test-utils'
import TypeScript from './components/TypeScript.vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import jestVue from 'vue-jest'
import RenderFunction from './components/RenderFunction.vue'
import Jade from './components/Jade.vue'
import FunctionalSFC from './components/FunctionalSFC.vue'
import FunctionalSFCRender from './components/FunctionalSFCRender.vue'
import Basic from './components/Basic.vue'
import BasicSrc from './components/BasicSrc.vue'
import { randomExport } from './components/NamedExport.vue'
import Coffee from './components/Coffee.vue'
import CoffeeScript from './components/CoffeeScript.vue'
import FunctionalSFCParent from './components/FunctionalSFCParent.vue'
import NoScript from './components/NoScript.vue'
import Pug from './components/Pug.vue'
import PugRelative from './components/PugRelativeExtends.vue'
import Jsx from './components/Jsx.vue'
import Constructor from './components/Constructor.vue'

test('processes .vue files', () => {
  const wrapper = mount(Basic)
  expect(wrapper.vm.msg).toEqual('Welcome to Your Vue.js App')
  wrapper.vm.toggleClass()
})

test('processes .vue files with src attributes', () => {
  const wrapper = mount(BasicSrc)
  wrapper.vm.toggleClass()
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

test('processes .vue file using jsx', () => {
  const wrapper = mount(Jsx)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes extended functions', () => {
  const wrapper = mount(Constructor)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes .vue file with lang set to coffee', () => {
  const wrapper = mount(Coffee)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes .vue file with lang set to coffeescript', () => {
  const wrapper = mount(CoffeeScript)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes .vue files with lang set to typescript', () => {
  const wrapper = mount(TypeScript)
  expect(wrapper.is('div')).toBeTruthy()
})

test('processes functional components', () => {
  const clickSpy = jest.fn()
  const wrapper = mount(FunctionalSFC, {
    context: {
      props: { msg: { id: 1, title: 'foo' }, onClick: clickSpy }
    }
  })
  expect(wrapper.text().trim()).toBe('foo')
  wrapper.trigger('click')
  expect(clickSpy).toHaveBeenCalledWith(1)
})

test('processes functional components using render function', () => {
  const wrapper = mount(FunctionalSFCRender)
  const CSS_CLASSES = ['ModuleClass']
  expect(wrapper.classes().toString()).toBe(CSS_CLASSES.toString())
})

test('processes SFC with functional template from parent', () => {
  const wrapper = mount(FunctionalSFCParent)
  expect(wrapper.text().trim()).toBe('foo')
})

test('handles missing script block', () => {
  const wrapper = mount(NoScript)
  expect(wrapper.contains('footer'))
})

test('processes .vue file with jade template', () => {
  const wrapper = mount(Jade)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.classes()).toContain('jade')
})

test('processes pug templates', () => {
  const wrapper = mount(Pug)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.classes()).toContain('pug-base')
  expect(wrapper.find('.pug-extended').exists()).toBeTruthy()
})

test('supports relative paths when extending templates from .pug files', () => {
  const wrapper = mount(PugRelative)
  expect(wrapper.is('div')).toBeTruthy()
  expect(wrapper.find('.pug-relative-base').exists()).toBeTruthy()
})

test('processes SFC with no template', () => {
  const wrapper = mount(RenderFunction)
  expect(wrapper.is('section')).toBe(true)
})
