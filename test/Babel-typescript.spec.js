import { resolve } from 'path'
import jestVue from '../vue-jest'
import {
  readFileSync,
  writeFileSync
} from 'fs'

import clearModule from 'clear-module'
import cache from '../lib/cache'

beforeEach(() => {
  cache.flushAll()
  clearModule.all()
})
test('babel 7 configuration expects filename [default: "unknown"] to compile', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  writeFileSync(babelRcPath, '{"presets": ["@babel/env"]}')

  try {
    expect(() => jestVue.process(fileString, filePath, undefined, undefined)).not.toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }
  writeFileSync(babelRcPath, babelRcOriginal)
})

test('renders typescript syntax from <script>...</script>', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  const filePath = resolve(__dirname, './resources/BabelTypescript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  // istanbul causes filename to be undefined, resulting babel error
  writeFileSync(babelRcPath, '{ "presets": ["@babel/env","@babel/typescript"], "plugins": ["@babel/transform-typescript","istanbul"] }')
  // babelVersion is not valid babel property, passing it to determine
  // which version of babel is used to transform in lib/compilers/babel-compiler
  // line 27
  try {
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: 'unknown' })).not.toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  try {
    writeFileSync(babelRcPath, '{ "presets": ["@babel/env","@babel/typescript"], "plugins": ["istanbul"] }')
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: undefined })).toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  const output = jestVue.process(fileString, filePath, undefined, undefined, { filename: 'unknown' })
  expect(output.code).toContain('coverageData.hash')
  writeFileSync(babelRcPath, babelRcOriginal)
})

