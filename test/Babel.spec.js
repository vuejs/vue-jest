import Vue from 'vue'
import Basic from './resources/Basic.vue'
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
  expect(typeof vm.$el).toBe('object')
})

test('processes .vue files with default babel if there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  renameSync(babelRcPath, tempPath)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  try {
    jestVue.process(fileString, filePath)
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    throw err
  }
  renameSync(tempPath, babelRcPath)
})

test('logs info when there is no .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  renameSync(babelRcPath, tempPath)
  const info = jest.spyOn(global.console, 'info')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  jestVue.process(fileString, filePath)
  try {
    expect(info).toHaveBeenCalledWith('\n[vue-jest] Info: no .babelrc found, defaulting to default babel options\n')
  } catch (err) {
    renameSync(tempPath, babelRcPath)
    throw err
  }
  renameSync(tempPath, babelRcPath)
  jest.resetModules()
})

test('uses babelrc in package.json if none in .babelrc', () => {
  const babelRcPath = resolve(__dirname, '../.babelrc')
  const tempPath = resolve(__dirname, '../.renamed')
  const packagePath = resolve(__dirname, '../package.json')
  const packageOriginal = readFileSync(packagePath, { encoding: 'utf8' })
  writeFileSync(packagePath, '{ "babel": {"presets": ["env"],"plugins": ["istanbul"]}}')
  renameSync(babelRcPath, tempPath)
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  try {
    const output = jestVue.process(fileString, filePath)
    expect(output).toContain('coverageData.hash')
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
  writeFileSync(babelRcPath, '{"presets": ["env"],"plugins": ["istanbul"]}')
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })

  const output = jestVue.process(fileString, filePath)
  writeFileSync(babelRcPath, babelRcOriginal)
  // coverageData.hash is added by babel-plugin-istanbul, added to root .babelrc for this test only
  expect(output).toContain('coverageData.hash')
})

test('generates inline sourcemap', () => {
  const expectedMap = '//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2ljLnZ1ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQWpCQSIsInNvdXJjZXNDb250ZW50IjpbIjx0ZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwiaGVsbG9cIj5cbiAgICAgICAgPGgxIDpjbGFzcz1cImhlYWRpbmdDbGFzc2VzXCI+e3sgbXNnIH19PC9oMT5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG4gICAgZXhwb3J0IGRlZmF1bHQge1xuICAgICAgICBuYW1lOiAnYmFzaWMnLFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgaGVhZGluZ0NsYXNzZXM6IGZ1bmN0aW9uIGhlYWRpbmdDbGFzc2VzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZDogdGhpcy5pc0NyYXp5LFxuICAgICAgICAgICAgICAgICAgICBibHVlOiAhdGhpcy5pc0NyYXp5LFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3c6IHRoaXMuaXNDcmF6eSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbXNnOiAnV2VsY29tZSB0byBZb3VyIFZ1ZS5qcyBBcHAnLFxuICAgICAgICAgICAgICAgIGlzQ3Jhenk6IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDcmF6eSA9ICF0aGlzLmlzQ3Jhenk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH07XG48L3NjcmlwdD5cbiJdfQ=='
  const filePath = resolve(__dirname, './resources/Basic.vue')
  const fileString = readFileSync(filePath, { encoding: 'utf8' })
  const output = jestVue.process(fileString, filePath)
  expect(output).toContain(expectedMap)
})
