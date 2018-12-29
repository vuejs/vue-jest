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
test.only('babel configuration expects filename [default: "unknown"] to compile', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  const filePath = resolve(__dirname, './resources/TypeScript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  writeFileSync(babelRcPath, '{"presets": ["env"],"plugins": ["istanbul"]}')

  try {
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: 'unknown' })).not.toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  try {
    expect(() => jestVue.process(fileString, filePath, undefined, undefined, { filename: undefined })).toThrow()
  } catch (err) {
    writeFileSync(babelRcPath, babelRcOriginal)
    throw err
  }

  writeFileSync(babelRcPath, babelRcOriginal)
})
