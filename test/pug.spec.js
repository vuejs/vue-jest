import { shallow } from 'vue-test-utils'
import { resolve } from 'path'
import Pug from './resources/Pug.vue'
import jestVue from '../vue-jest'
import { readFileSync } from 'fs'

test('processes .vue file with pug template', () => {
  const wrapper = shallow(Pug)
  expect(wrapper.is('div')).toBe(true)
  expect(wrapper.hasClass('pug')).toBe(true)
})

test('supports global pug options and extends templates correctly from .pug files', () => {
  const filePath = resolve(__dirname, './resources/PugExtends.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const compiled = jestVue.process(fileString, filePath, {
    globals: {
      'vue-jest': {
        pug: {
          basedir: 'test'
        }
      }
    }
  })

  expect(compiled.code).toContain('pug-base')
  expect(compiled.code).toContain('pug-extended')
})

test('supports relative paths when extending templates from .pug files', () => {
  const filePath = resolve(__dirname, './resources/PugRelativeExtends.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const compiled = jestVue.process(fileString, filePath)
  expect(compiled.code).toContain('pug-relative-base')
  expect(compiled.code).toContain('pug-extended')
})
