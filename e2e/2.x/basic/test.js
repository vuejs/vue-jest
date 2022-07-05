import { mount } from '@vue/test-utils'
import TypeScript from './components/TypeScript.vue'
import TemplateString from './components/TemplateString.vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import jestVue from '@vue/vue2-jest'
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
import { compileStyle } from '@vue/component-compiler-utils'
import ScriptSetup from './components/ScriptSetup'
jest.mock('@vue/component-compiler-utils', () => ({
  ...jest.requireActual('@vue/component-compiler-utils'),
  compileStyle: jest.fn(() => ({ errors: [], code: '' }))
}))

beforeEach(() => jest.clearAllMocks())
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
  const config = {
    moduleFileExtensions: ['js', 'vue']
  }

  const { map } = jestVue.process(fileString, filePath, {
    config
  })

  expect(map).toMatchSnapshot()
})

test('generates source maps using src attributes', () => {
  const filePath = resolve(__dirname, './components/SourceMapsSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const config = {
    moduleFileExtensions: ['js', 'vue']
  }

  const { map } = jestVue.process(fileString, filePath, {
    config
  })

  expect(map).toMatchSnapshot()
})

test('processes .vue file using jsx', () => {
  const wrapper = mount(Jsx)
  expect(wrapper.element.tagName).toBe('DIV')
})

test('processes extended functions', () => {
  const wrapper = mount(Constructor)
  expect(wrapper.element.tagName).toBe('DIV')
})

test('processes .vue file with lang set to coffee', () => {
  const wrapper = mount(Coffee)
  expect(wrapper.element.tagName).toBe('DIV')
})

test('processes .vue file with lang set to coffeescript', () => {
  const wrapper = mount(CoffeeScript)
  expect(wrapper.element.tagName).toBe('DIV')
})

test('processes .vue files with lang set to typescript', () => {
  const wrapper = mount(TypeScript)
  expect(wrapper.element.tagName).toBe('DIV')
})

test('processes .vue files with template strings in the template', () => {
  const wrapper = mount(TemplateString)
  expect(wrapper.attributes('data-sth')).toBe(`
      query {
        id
      }
    `)
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
  expect(wrapper.element.tagName).toBe('FOOTER')
})

test('processes .vue file with jade template', () => {
  const wrapper = mount(Jade)
  expect(wrapper.element.tagName).toBe('DIV')
  expect(wrapper.classes()).toContain('jade')
})

test('processes pug templates', () => {
  const wrapper = mount(Pug)
  expect(wrapper.element.tagName).toBe('DIV')
  expect(wrapper.classes()).toContain('pug-base')
  expect(wrapper.find('.pug-extended').exists()).toBeTruthy()
})

test('supports relative paths when extending templates from .pug files', () => {
  const wrapper = mount(PugRelative)
  expect(wrapper.element.tagName).toBe('DIV')
  expect(wrapper.find('.pug-relative-base').exists()).toBeTruthy()
})

test('processes SFC with no template', () => {
  const wrapper = mount(RenderFunction)
  expect(wrapper.element.tagName).toBe('SECTION')
})

test('processes SFC with <script setup>', () => {
  const wrapper = mount(ScriptSetup)
  expect(wrapper.html()).toContain('Count: 5')
  expect(wrapper.html()).toContain('Welcome to Your Vue.js App')
})

test('should pass properly "styleOptions" into "preprocessOptions"', () => {
  const filePath = resolve(__dirname, './components/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const config = {
    moduleFileExtensions: ['js', 'vue'],
    globals: {
      'vue-jest': {
        styleOptions: {
          quietDeps: true
        }
      }
    }
  }

  jestVue.process(fileString, filePath, {
    config
  })

  expect(compileStyle.mock.calls[0][0].preprocessOptions).toStrictEqual({
    quietDeps: true
  })
  expect(compileStyle.mock.calls[1][0].preprocessOptions).toStrictEqual({
    quietDeps: true
  })
})
