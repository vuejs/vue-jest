import Vue from 'vue'
import Basic from './resources/Basic.vue'
import BasicSrc from './resources/BasicSrc.vue'
import jestVue from '../vue-jest'
import { resolve } from 'path'
import {
  readFileSync,
  writeFileSync,
  renameSync
} from 'fs'
import clearModule from 'clear-module'
import cache from '../lib/cache'

beforeEach(() => {
  cache.flushAll()
  clearModule.all()
})

test('processes .vue files', () => {
  const vm = new Vue(Basic).$mount()
  vm.toggleClass()
  expect(typeof vm.$el).toBe('object')
})

test('processes .vue files using src attributes', () => {
  const vm = new Vue(BasicSrc).$mount()
  expect(typeof vm.$el).toBe('object')
})

test('skip processing if there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcPath2 = resolve(__dirname, '../../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  const tempPath2 = resolve(__dirname, '../../.renamed')
  renameSync(babelRcPath, tempPath)
  renameSync(babelRcPath2, tempPath2)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  try {
    jestVue.process(fileString, filePath)
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    renameSync(tempPath2, babelRcPath2)
    throw err
  }
  renameSync(tempPath, babelRcPath)
  renameSync(tempPath2, babelRcPath2)
})

test('logs info when there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcPath2 = resolve(__dirname, '../../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  const tempPath2 = resolve(__dirname, '../../.renamed')
  renameSync(babelRcPath, tempPath)
  renameSync(babelRcPath2, tempPath2)
  const info = jest.spyOn(global.console, 'info')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  jestVue.process(fileString, filePath)
  try {
    expect(info).toHaveBeenCalledWith('\n[vue-jest]: no .babelrc found, skipping babel compilation\n')
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    renameSync(tempPath2, babelRcPath2)
    throw err
  }
  renameSync(tempPath, babelRcPath)
  renameSync(tempPath2, babelRcPath2)
  jest.resetModules()
})

test('uses babelrc in package.json if none in .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  const packagePath = resolve(__dirname, '../package.json')
  const packageOriginal = readFileSync(packagePath, { encoding: 'utf8' })
  writeFileSync(packagePath, '{ "babel": {"presets": ["@babel/env"],"plugins": ["istanbul"]}}')
  renameSync(babelRcPath, tempPath)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  try {
    const output = jestVue.process(fileString, filePath)
    expect(output.code).toContain('coverageData.hash')
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    writeFileSync(packagePath, packageOriginal)
    jest.resetModules()
    throw err
  }
  renameSync(tempPath, babelRcPath)
  writeFileSync(packagePath, packageOriginal)
  jest.resetModules()
})

test('processes .vue files using .babelrc if it exists in route', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const babelRcOriginal = readFileSync(babelRcPath, { encoding: 'utf8' })
  writeFileSync(babelRcPath, '{"presets": ["@babel/env"],"plugins": ["istanbul"]}')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const output = jestVue.process(fileString, filePath)
  writeFileSync(babelRcPath, babelRcOriginal)
  // coverageData.hash is added by babel-plugin-istanbul, added to root .babelrc for this test only
  expect(output.code).toContain('coverageData.hash')
})

test('generates inline sourcemap', () => {
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const output = jestVue.process(fileString, filePath)
  expect(output.code).toMatchSnapshot()
})

test('generates inline sourcemap for .vue files using src attributes', () => {
  const filePath = resolve(__dirname, './resources/BasicSrc.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const output = jestVue.process(fileString, filePath)
  expect(output.code).toMatchSnapshot()
})
