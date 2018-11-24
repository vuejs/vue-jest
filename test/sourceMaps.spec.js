import { resolve } from 'path'
import { readFileSync } from 'fs'
import clearModule from 'clear-module'
import cache from '../lib/cache'
import jestVue from '../vue-jest'

beforeEach(() => {
  cache.flushAll()
  clearModule.all()
})

const getSourceMaps = code => {
  const sourceMapBase64 = /\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,(.*)/gim

  let matches
  let values = []

  while ((matches = sourceMapBase64.exec(code)) !== null) {
    values.push(JSON.parse(Buffer.from(matches[1], 'base64').toString('ascii')))
  }

  return values
}

test('generates source maps for .vue files', () => {
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

  const [template, js] = getSourceMaps(code)

  expect(js.sources[0]).toBe('Basic.vue')
  expect(template.sources[0]).toBe('Basic.vue')
})

test('generates source maps using src attributes', () => {
  const filePath = resolve(__dirname, './resources/SourceMapsSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const { code } = jestVue.process(fileString, filePath, {
    moduleFileExtensions: ['js', 'vue']
  })

  const [template, js] = getSourceMaps(code)

  expect(js.sources[0]).toBe('BasicSrc.js')
  expect(template.sources[0]).toBe('SourceMapsSrc.vue')
})
