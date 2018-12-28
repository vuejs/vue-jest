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
test.only('@babel/preset-typescript fix', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  const filePath = resolve(__dirname, './resources/TypeScript.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  writeFileSync(babelRcPath, '{"presets": ["@babel/env","@babel/typescript"],"plugins": ["istanbul"]}')
  const output = jestVue.process(fileString, filePath)
  // coverageData.hash is added by babel-plugin-istanbul, added to root .babelrc for this test only
  expect(output.code).toContain('coverageData.hash')

  writeFileSync(babelRcPath, babelRcOriginal)
})
