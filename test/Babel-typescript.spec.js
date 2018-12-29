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
  const filePath = resolve(__dirname, './resources/TypeScript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  writeFileSync(babelRcPath, '{"presets": ["@babel/env"],"plugins": ["istanbul"]}')

  try {
    // babelVersion is not valid babel property, passing it to determine
    // which version of babel is used to transform in lib/compilers/babel-compiler
    // line 27
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: 'unknown', babelVersion: 7 })).not.toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  try {
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: undefined, babelVersion: 7 })).toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  writeFileSync(babelRcPath, babelRcOriginal)
})
