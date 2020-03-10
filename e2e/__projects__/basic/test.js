import { mount, createLocalVue } from '@vue/test-utils'
import TypeScript from './components/TypeScript.vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import VueI18n from 'vue-i18n'
import jestVue from 'vue-jest'
import RenderFunction from './components/RenderFunction.vue'
import Jade from './components/Jade.vue'
import FunctionalSFC from './components/FunctionalSFC.vue'
import Basic from './components/Basic.vue'
import BasicSrc from './components/BasicSrc.vue'
import { randomExport } from './components/NamedExport.vue'
import Coffee from './components/Coffee.vue'
import CoffeeScript from './components/CoffeeScript.vue'
import FunctionalSFCParent from './components/FunctionalSFCParent.vue'
import I18nJSONInline from './components/I18nJSONInline.vue'
import I18nJSONFromSrc from './components/I18nJSONFromSrc.vue'
import I18nYamlInline from './components/I18nYamlInline.vue'
import I18nMergingMultipleBlocks from './components/I18nMergingMultipleBlocks.vue'
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

describe('I18n Processor', () => {
  const setup = (opts = { locale: 'en' }) => {
    const localVue = createLocalVue()
    localVue.use(VueI18n)
    const i18n = new VueI18n(opts)
    return { i18n, localVue }
  }

  test('processes SFC with i18n JSON inline custom block', () => {
    const { i18n, localVue } = setup()
    const wrapper = mount(I18nJSONInline, { i18n, localVue })
    expect(wrapper.text()).toBe('Hello i18n in SFC!')
    expect(wrapper).toMatchSnapshot()
  })

  test('processes SFC with i18n JSON in external src attribute', () => {
    const { i18n, localVue } = setup()
    const wrapper = mount(I18nJSONFromSrc, { i18n, localVue })
    expect(wrapper.text()).toBe('Hello i18n in SFC!')
    expect(wrapper).toMatchSnapshot()
  })

  test('processes SFC with i18n Yaml Inline', () => {
    const { i18n, localVue } = setup()
    const wrapper = mount(I18nYamlInline, { i18n, localVue })
    expect(wrapper.text()).toBe('hello world!')
    expect(wrapper).toMatchSnapshot()
  })

  test('merges data blocks', () => {
    const { i18n, localVue } = setup()
    const wrapper = mount(I18nMergingMultipleBlocks, { i18n, localVue })
    expect(wrapper.text()).toBe('hello world!')
    expect(typeof wrapper.vm.$t('additionalKey')).toEqual('string')

    expect(wrapper).toMatchSnapshot()
  })
})
